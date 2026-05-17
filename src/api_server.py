import eventlet
eventlet.monkey_patch()

import yfinance as yf
import pandas as pd
import random
import time
import os
import csv
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
# Render போன்ற ஹோஸ்டிங்குகளில் WebSocket கச்சிதமாக வேலை செய்ய 'eventlet' மோட் முக்கியம் அண்ணா
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# தற்போதைய ஸ்கிரிப்ட் ஸ்டாக்
current_script = "^NSEI"
# Render சர்வரில் டேட்டா அழியாமல் இருக்க தற்காலிகமாக /tmp ஃபோல்டரில் சேமிக்கிறோம்
LOG_FILE = '/tmp/trade_log.csv' if os.environ.get('RENDER') else 'trade_log.csv'

# --- 📁 DATA SAVING LOGIC ---
def log_trade(symbol, strike, option_type, quantity, action, price):
    """ட்ரேடிங் விவரங்களை CSV கோப்பில் பாதுகாப்பாகச் சேமிக்கும் அண்ணா"""
    file_exists = os.path.isfile(LOG_FILE)
    try:
        with open(LOG_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            if not file_exists:
                # டேஷ்போர்டுக்குத் தேவையான முழுமையான தலைப்புகள் (Headers)
                writer.writerow(['Timestamp', 'Symbol', 'Strike', 'OptionType', 'Quantity', 'Action', 'Price'])
            
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            writer.writerow([timestamp, symbol, strike, option_type, quantity, action, price])
        print(f"✅ Trade Logged: {symbol} | {strike} {option_type} | {action} | ₹{price}")
    except Exception as e:
        print(f"❌ Log Error: {e}")

# --- 📊 YAHOO FINANCE DATA FETCHING ---
def get_yahoo_history(symbol):
    try:
        print(f"📊 {symbol} வரலாற்றுத் தரவுகளை (History) எடுக்கிறேன் அண்ணா...")
        # இண்டெக்ஸ் குறியீடுகள் தவிர மற்றவற்றுக்கு .NS சேர்க்கிறோம்
        search_symbol = symbol if ("^" in symbol or ".NS" in symbol) else f"{symbol}.NS"
        
        df = yf.download(search_symbol, period="2d", interval="5m", progress=False)
        if df.empty: 
            return []
        
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        
        history = []
        for index, row in df.iterrows():
            history.append({
                "time": int(index.timestamp()),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close'])
            })
        return history
    except Exception as e:
        print(f"❌ History Fetch Error: {e}")
        return []

# --- 🔄 LIVE ENGINE (SIMULATION) ---
def live_engine():
    global current_script
    print("🚀 Live Engine Simulation Started Successfully...")
    while True:
        try:
            # ஸ்டாக்கிற்கு தகுந்தவாறு விலையைத் தோராயமாக மாற்றுவது அண்ணா
            if "BANK" in current_script:
                base_price = 48500
            elif "RELIANCE" in current_script:
                base_price = 2500
            else:
                base_price = 22500 # NIFTY 50 போன்றவற்றுக்கு
                
            price = round(base_price + random.uniform(-15, 15), 2)
            mtm_sim = str(round(random.uniform(-500, 3500), 2))
            
            data_packet = {
                "symbol": current_script,
                "time": int(time.time() // 60) * 60,
                "price": price,
                "mtm": mtm_sim
            }
            # வெப்சாக்கெட் வழியாக ரியாக்ட்-க்கு லைவ் டேட்டாவை புஷ் செய்கிறோம் அண்ணா!
            socketio.emit('candle_update', data_packet)
            eventlet.sleep(2) # 2 வினாடிக்கு ஒருமுறை அப்டேட்
        except Exception as e:
            print(f"❌ Engine Loop Error: {e}")
            eventlet.sleep(2)

# --- 🌐 API ROUTES (டேஷ்போர்டுடன் கச்சிதமாகப் பொருந்துபவை) ---

@app.route('/api/login', methods=['POST'])
def login():
    """டேஷ்போர்டு லாகின் எர்ரரை (404 Not Found) சரிசெய்யும் புதிய பகுதி அண்ணா! ✅"""
    try:
        data = request.json or {}
        user_id = data.get('userId') or data.get('username')
        password = data.get('password')
        
        print(f"🔑 Login Attempt - User: {user_id}")
        
        # அண்ணா கொடுத்த டெஸ்ட் லாகின் கண்டிஷன் (E1S69 / 12345)
        if user_id == "E1S69" and password == "12345":
            return jsonify({
                "stat": "Ok", 
                "message": "Login Success",
                "token": "dummy_token_12345",
                "userId": user_id
            })
        else:
            return jsonify({"stat": "Not_Ok", "message": "Invalid User ID or Password"}), 401
    except Exception as e:
        print(f"❌ Login Route Error: {e}")
        return jsonify({"stat": "Error", "message": "Internal Server Error"}), 500

@app.route('/api/history')
def history():
    symbol = request.args.get('symbol', '^NSEI')
    global current_script
    current_script = symbol
    data = get_yahoo_history(symbol)
    return jsonify(data)

@app.route('/api/live_data')
def live_data():
    """டேஷ்போர்டு 2 விநாடிக்கு ஒருமுறை LTP மற்றும் P&L கேட்கும் ரூட் அண்ணா"""
    global current_script
    if "BANK" in current_script:
        base_price = 48500
    elif "RELIANCE" in current_script:
        base_price = 2500
    else:
        base_price = 22500

    price = round(base_price + random.uniform(-10, 10), 2)
    return jsonify({
        "price": str(price),
        "mtm": str(round(random.uniform(-200, 1500), 2)),
        "stat": "Ok"
    })

@app.route('/api/start_algo', methods=['POST'])
def start_algo():
    """டேஷ்போர்டில் START ZEBU ALGO அழுத்தினால் இங்கே வரும்"""
    data = request.json
    print(f"🔐 Zebu Login Triggered for User: {data.get('userId')}")
    return jsonify({"stat": "Ok", "message": "Zebu Algo Started Successfully 🚀"})

@app.route('/api/manual_order', methods=['POST'])
def manual_order():
    """டேஷ்போர்டில் BUY / SELL பட்டன் அழுத்தினால் வேலை செய்யும் பகுதி அண்ணா"""
    data = request.json
    symbol = data.get('symbol', current_script)
    strike = data.get('strike', '22500')
    option_type = data.get('option_type', 'CE')
    quantity = data.get('quantity', 25)
    action = data.get('action', 'BUY') # BUY or SELL
    
    # தற்போதைய விலையை சிமுலேட் செய்கிறோம்
    current_price = 48500 if "BANK" in symbol else (2500 if "RELIANCE" in symbol else 22500)
    
    # ட்ரேடை CSV-யில் லாக் செய்கிறோம் அண்ணா
    log_trade(symbol, strike, option_type, quantity, action, current_price)
    
    return jsonify({"stat": "Ok", "message": f"{action} Order Executed Successfully!"})

@app.route('/api/square_off_all', methods=['POST'])
def square_off_all():
    """அனைத்து பொசிஷன்களையும் மூடி (Square Off) நிறுத்த அண்ணா"""
    print("🛑 Emergency All Square Off Triggered!")
    return jsonify({"stat": "Ok", "message": "All Positions Squared Off Successfully"})

@app.route('/api/trade_history')
def get_logs():
    """டேஷ்போர்டில் முந்தைய ட்ரேடிங் ஹிஸ்டரியை காட்ட உதவும்"""
    logs = []
    if os.path.isfile(LOG_FILE):
        with open(LOG_FILE, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                logs.append(row)
    return jsonify(logs[::-1]) # புதிய ஆர்டர்கள் மேலே தெரிய Reverse செய்கிறோம்

# --- 🚀 ENGINE START & PORT BINDING ---
port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    # சர்வர் தொடங்கும்போதே லைவ் சிமுலேஷன் எஞ்சினையும் பின்னணியில் (Background) இயக்குகிறோம்
    eventlet.spawn(live_engine)
    print(f"🚀 Algo Server Running Successfully on Port: {port}")
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
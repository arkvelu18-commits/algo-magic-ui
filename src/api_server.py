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
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# தற்போதைய ஸ்கிரிப்ட்
current_script = "^NSEI"
# Render போன்ற சர்வர்களில் தற்காலிகமாக ஃபைல் சேமிக்க /tmp ஃபோல்டரைப் பயன்படுத்துவது நல்லது
LOG_FILE = '/tmp/trade_log.csv' if os.environ.get('RENDER') else 'trade_log.csv'

# --- 📁 DATA SAVING LOGIC ---
def log_trade(symbol, side, price):
    """ஆர்டர் விவரங்களை CSV ஃபைலில் சேமிக்கும்"""
    file_exists = os.path.isfile(LOG_FILE)
    try:
        with open(LOG_FILE, mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists:
                # தலைப்புகள் (Headers)
                writer.writerow(['Timestamp', 'Symbol', 'Side', 'Price'])
            
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            writer.writerow([timestamp, symbol, side, price])
        print(f"✅ Trade Saved: {symbol} | {side} | {price}")
    except Exception as e:
        print(f"❌ Log Error: {e}")

# --- 📊 DATA FETCHING ---
def get_yahoo_history(symbol):
    try:
        print(f"📊 {symbol} டேட்டாவை எடுக்கிறேன்...")
        # Yahoo குறியீடு சரிசெய்தல்
        search_symbol = symbol if "^" in symbol else f"{symbol}.NS"
        
        df = yf.download(search_symbol, period="2d", interval="1m", progress=False)
        if df.empty: return []
        
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
        print(f"❌ History Error: {e}")
        return []

def live_engine():
    global current_script
    while True:
        try:
            # லைவ் டேட்டா சிமுலேஷன்
            base_price = 24500 if "^NSEI" in current_script else 3000
            price = round(base_price + random.uniform(-5, 5), 2)
            
            data_packet = {
                "symbol": current_script,
                "time": int(time.time() // 60) * 60,
                "price": price,
                "mtm": str(round(random.uniform(-1000, 5000), 2))
            }
            socketio.emit('candle_update', data_packet)
            eventlet.sleep(1)
        except:
            eventlet.sleep(1)

# --- 🌐 API ROUTES ---

@app.route('/api/history')
def history():
    symbol = request.args.get('symbol', '^NSEI')
    global current_script
    current_script = symbol
    data = get_yahoo_history(symbol)
    return jsonify(data)

@app.route('/api/place_order', methods=['POST'])
def place_order():
    """டேஷ்போர்டில் இருந்து BUY/SELL பட்டன் அழுத்தினால் இங்கே வரும்"""
    data = request.json
    symbol = data.get('symbol')
    side = data.get('side') # BUY or SELL
    
    # இப்போதைய விலையைத் தோராயமாக எடுக்கிறோம்
    price = 24500 if "^NSEI" in symbol else 3000 
    
    # டேட்டாவை சேமிக்கிறோம் (நெட்டில் அப்லோட் செய்வதற்கு முன் இது லோக்கலில் சேமிக்கப்படும்)
    log_trade(symbol, side, price)
    
    return jsonify({"stat": "Ok", "message": f"{side} Order Placed Successfully"})

@app.route('/api/trade_history')
def get_logs():
    """சேமிக்கப்பட்ட ட்ரேடிங் விவரங்களை எடுத்து அனுப்பும்"""
    logs = []
    if os.path.isfile(LOG_FILE):
        with open(LOG_FILE, mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                logs.append(row)
    return jsonify(logs[::-1]) # புதிய விவரங்கள் முதலில் வர (Reverse)

@app.route('/api/start_algo', methods=['POST'])
def start_algo():
    return jsonify({"stat": "Ok"})

# --- 🚀 RENDER PORT BINDING FIX ---
if __name__ == '__main__':
    eventlet.spawn(live_engine)
    
    # Render வழங்கும் ஆன்லைன் போர்ட்டை எடுக்கிறது, லோக்கலில் இருந்தால் 5000 போர்ட்டை எடுக்கும்
    port = int(os.environ.get("PORT", 5000))
    
    print(f"🚀 Algo Server Running Successfully on Port: {port}")
    # Render சர்வருக்காக host='0.0.0.0' என்று மாற்றப்பட்டுள்ளது
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
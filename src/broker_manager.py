import time
import hashlib
import requests
from datetime import datetime

# --- பகுதி 1: ZebullAPI கிளாஸ் (நேரடியாக இங்கே இணைக்கப்பட்டுள்ளது) ---
def encrypt_string(hashing):
    return hashlib.sha256(hashing.encode()).hexdigest()

class ZebullAPI(object):
    base_url = "https://zebull.in/rest/MobullService/api/"
    _sub_urls = {
        "encryption_key": "customer/getAPIEncpkey",
        "getsessiondata": "customer/getUserSID",
        "scripdetails": "ScripDetails/getScripQuoteDetails",
        "historical_data": "chart/getChartData" 
    }

    def __init__(self, user_id, api_key):
        self.user_id = user_id
        self.api_key = api_key
        self.session_id = None

    def _post(self, sub_url, data=None):
        url = self.base_url + self._sub_urls[sub_url]
        headers = {
            "Content-Type": "application/json",
            "X-SAS-Version": "2.0",
            "Authorization": f"Bearer {self.user_id} {self.session_id}" if self.session_id else ""
        }
        try:
            response = requests.post(url, json=data, headers=headers, timeout=15)
            return response.json() if response.status_code == 200 else {}
        except:
            return {}

    def getEncryptionKey(self):
        res = self._post("encryption_key", {'userId': self.user_id})
        if res and res.get('encKey'):
            hashing_str = self.user_id + self.api_key + res['encKey']
            hashed = encrypt_string(hashing_str)
            login_res = self._post("getsessiondata", {'userId': self.user_id, 'userData': hashed})
            if login_res and login_res.get('stat') == 'Ok':
                self.session_id = login_res.get('sessionID')
            return login_res
        return {"stat": "Not Ok"}

# --- பகுதி 2: BrokerManager (ஆல்கோ மேலாளர்) ---
class BrokerManager:
    def __init__(self):
        self.api = None
        self.is_connected = False

    def login_broker(self, user_id, api_key):
        try:
            print(f"⏳ Official Zebu Login for {user_id}...")
            # 💡 இங்கே கவனியுங்கள்: இம்போர்ட் தேவையில்லை, நேரடியாக கிளாஸை அழைக்கிறோம்
            self.api = ZebullAPI(user_id, api_key)
            res = self.api.getEncryptionKey()
            
            if res and res.get('stat') == 'Ok':
                self.is_connected = True
                print("✅ Zebu Connected Successfully!")
                return {"status": "success", "data": res}
            return {"status": "error", "message": "Invalid Login"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def get_historical_candles(self, exchange="NSE", symbol="26000"):
        if not self.is_connected: return []
        now = datetime.now()
        f_date = now.replace(hour=9, minute=15).strftime('%Y-%m-%d %H:%M:%S')
        t_date = now.strftime('%Y-%m-%d %H:%M:%S')
        
        # 'historical_data' ரூட்டைப் பயன்படுத்த உங்கள் zebullapi-ல் உள்ள பங்க்ஷன்
        data = {'exch': exchange, 'symbol': symbol, 'fromDate': f_date, 'toDate': t_date, 'interval': "1"}
        raw = self.api._post("historical_data", data)
        return raw if isinstance(raw, list) else []

    def get_live_tick(self, exchange="NSE", symbol="26000"):
        if not self.is_connected: return None
        res = self.api._post("scripdetails", {'exch': exchange, 'symbol': symbol})
        if res and 'lp' in res:
            return {"time": int(time.time()), "close": float(res['lp'])}
        return None

algo_manager = BrokerManager()
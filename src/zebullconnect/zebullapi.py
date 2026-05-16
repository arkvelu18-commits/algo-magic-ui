import time
from datetime import datetime, timedelta
from zebullconnect.zebullapi import ZebullAPI # உங்கள் ஃபோல்டர் ஸ்ட்ரக்சர் படி

class BrokerManager:
    def __init__(self):
        self.api = None
        self.is_connected = False

    def login_broker(self, user_id, api_key, totp):
        self.api = ZebullAPI(user_id, api_key)
        res = self.api.getEncryptionKey() # இதில் totp-யும் சேர்க்க வேண்டும்
        if res.get('stat') == 'Ok':
            self.is_connected = True
            return True
        return False

    def get_initial_chart_data(self, symbol="26000"):
        """அடுத்த கட்டம்: பழைய டேட்டாவை லோடு செய்வது"""
        if not self.is_connected: return []
        
        # இன்று காலை 9:15 முதல் இப்போது வரை
        now = datetime.now()
        start_time = now.replace(hour=9, minute=15).strftime('%Y-%m-%d %H:%M:%S')
        end_time = now.strftime('%Y-%m-%d %H:%M:%S')
        
        # ஜேபுவின் ஹிஸ்டாரிக்கல் ரூட்
        hist_data = self.api.get_candles("NSE", symbol, start_time, end_time, "1")
        return hist_data

algo_manager = BrokerManager()
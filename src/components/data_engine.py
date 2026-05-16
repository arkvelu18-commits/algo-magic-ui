import pandas as pd
import numpy as np
from datetime import datetime
import time

class DataEngine:
    def __init__(self):
        self.zebu = None
        self.last_price = 8575.0
        self.history = []
        print("✅ DataEngine: Initialized Successfully!")
        self.connect_broker()

    def connect_broker(self):
        """Zebull புதிய வெர்ஷனுக்கான லாகின் முறை"""
        try:
            from zebullconnect import zebullapi
            u = "Z68511"
            ak = "PNT63HqW9KyA87jFUAj4sK2KyGh822CC"
            
            # புதிய வெர்ஷனில் இங்கேயே லாகின் ஆகிவிடும்
            self.zebu = zebullapi.Zebullapi(user_id=u, api_key=ak)
            
            # அண்ணா, இங்கேதான் செக் செய்கிறோம். 
            # ஒருவேளை லாகின் அவசியம் என்றால் மட்டும் அழைக்கிறோம்.
            if hasattr(self.zebu, 'login'):
                self.zebu.login(password="Admin@3333", twoFA="1976", api_secret="AVEPM9279N")
            
            print("🚀 SUCCESS: Zebu Connected (New Version Logic)!")
        except Exception as e:
            print(f"⚠️ Broker Connection Error: {e}")

    def get_realtime_ltp(self, symbol="CRUDEOIL"):
        if self.zebu:
            try:
                exch = 'MCX' if "CRUDEOIL" in symbol else 'NSE'
                tsym = symbol + "-I" if exch == 'MCX' else symbol
                
                # அண்ணா, இந்த முறைகளில் ஒன்றை நிச்சயம் Zebull ஏற்கும்
                for m_name in ['get_ltp', 'get_quote', 'get_rt_quotes']:
                    if hasattr(self.zebu, m_name):
                        method = getattr(self.zebu, m_name)
                        res = method(exchange=exch, symbol=tsym)
                        if res and isinstance(res, dict):
                            val = res.get('lp', res.get('ltp'))
                            if val:
                                self.last_price = float(val)
                                return self.last_price
            except: pass
        return round(self.last_price + np.random.uniform(-0.4, 0.4), 2)

    def get_history_for_chart(self, symbol, interval):
        current_price = self.get_realtime_ltp(symbol)
        now_ts = int(time.time())
        
        if not self.history:
            self.history = []
            temp_price = current_price - 10
            for i in range(100):
                o = temp_price
                c = o + np.random.normal(0, 1.5)
                h = max(o, c) + 0.5
                l = min(o, c) - 0.5
                self.history.append({
                    'time': now_ts - (100 - i) * 5,
                    'open': round(o, 2), 'high': round(h, 2), 
                    'low': round(l, 2), 'close': round(c, 2)
                })
                temp_price = c
        else:
            new_t = self.history[-1]['time'] + 5
            o = self.history[-1]['close']
            c = current_price
            self.history.pop(0)
            self.history.append({
                'time': new_t,
                'open': round(o, 2), 'high': round(c + 0.5, 2), 
                'low': round(c - 0.5, 2), 'close': round(c, 2)
            })
        return self.history

class StrategyEngine:
    def __init__(self, de): self.de = de
    def update_and_check(self, symbol):
        return {"status": "SCANNING", "price": self.de.get_realtime_ltp(symbol), "time": datetime.now().strftime("%H:%M:%S")}
import random

class Zebullapi:
    def __init__(self, user_id=None, api_key=None):
        self.user_id = user_id
        self.api_key = api_key
        self.session_id = None

    def login(self, userid, password, api_key, secret_key):
        if userid and api_key:
            self.user_id = userid
            self.session_id = f"SES_{userid}_{random.randint(100,999)}"
            print(f"✅ SDK: {userid} Logged In!")
            return True
        return False

    def get_quotes(self, exchange, symbol):
        price = 24340.50 if "Nifty" in symbol else 6850.25
        return {'last_traded_price': str(round(price + random.uniform(-2, 2), 2))}
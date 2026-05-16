import json
import requests
import socketio

class XTSConnect:
    def __init__(self, apiKey, secretKey, source, root):
        self.apiKey = apiKey
        self.secretKey = secretKey
        self.source = source
        self.root = root
        self.token = None
        self.userID = None

    def marketdata_login(self):
        url = f"{self.root}/marketdata/auth/login"
        payload = {"appKey": self.apiKey, "secretKey": self.secretKey, "source": self.source}
        res = requests.post(url, json=payload)
        res_data = res.json()
        if res_data['type'] == 'success':
            self.token = res_data['result']['token']
            self.userID = res_data['result']['publishId']
        return res_data

    def interactive_login(self):
        url = f"{self.root}/interactive/auth/login"
        payload = {"appKey": self.apiKey, "secretKey": self.secretKey, "source": self.source}
        res = requests.post(url, json=payload)
        return res.json()

class MarketDataSocket:
    def __init__(self, token, userID, root):
        self.token = token
        self.userID = userID
        self.root = root
        self.sio = socketio.Client()

    def connect(self):
        url = f"{self.root}/?token={self.token}&userID={self.userID}&publishId={self.userID}&broadcastMode=full"
        self.sio.connect(url, transports=['websocket'])
        self.sio.wait()

    def subscribe(self, instruments, xtsMessageCode):
        payload = {"instruments": instruments, "xtsMessageCode": xtsMessageCode}
        self.sio.emit('subscribe', payload)
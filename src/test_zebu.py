import requests

# ஐடி டீம் கொடுத்த புதிய விவரங்கள்
CLIENT_ID = "E1S01"
CLIENT_SECRET = "HDl3PtVtvTWuzWYQ6o0oWmoQUsF0QJrW"
# ஒருவேளை ஐடி டீம் வேறு ரீடைரக்ட் URL கொடுத்திருந்தால் அதை இங்கே மாற்றவும்
REDIRECT_URI = "http://127.0.0.1:5000" 

def check_zebu_connection():
    # இதுதான் ஜேபுவின் புதிய லாகின் பக்கம்
    auth_url = (
        f"https://api.zebull.in/oauth/authorize?"
        f"client_id={CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={REDIRECT_URI}"
    )
    
    print("\n" + "="*50)
    print("🔑 ZEBU OAUTH CONNECTION TEST")
    print("="*50)
    print("\nஅண்ணா, கீழே உள்ள லிங்க்கை அப்படியே காப்பி செய்து")
    print("உங்கள் பிரவுசரில் (Chrome/Edge) போட்டு என்டர் தட்டுங்கள்:")
    print("\n" + "-"*50)
    print(auth_url)
    print("-" * 50)
    print("\nசோதனை முடிவுகள்:")
    print("1. ஜேபு லாகின் பக்கம் வந்தால் -> சாவி வேலை செய்கிறது! ✅")
    print("2. 'Invalid Client' என்று வந்தால் -> Client ID தப்பு. ❌")
    print("3. 'Invalid Redirect' வந்தால் -> Redirect URI தப்பு. ❌")
    print("\n" + "="*50)

if __name__ == "__main__":
    check_zebu_connection()
import requests

# ஐடி டீம் கொடுத்த புதிய விவரங்கள்
CLIENT_ID = "E1S01"
CLIENT_SECRET = "HDl3PtVtvTWuzWYQ6o0oWmoQUsF0QJrW"
REDIRECT_URI = "http://127.0.0.1:5000" 

def check_zebu_connection():
    # OAuth லாகின் லிங்க்
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
    print("\nஜேபு லாகின் பக்கம் வந்தால் சாவி வேலை செய்கிறது! ✅")
    print("="*50)

if __name__ == "__main__":
    check_zebu_connection()
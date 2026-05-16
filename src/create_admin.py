import sqlite3

# உங்கள் புராஜெக்டில் உள்ள அதே டேட்டாபேஸ் பெயரை பயன்படுத்துகிறோம்
conn = sqlite3.connect('danavriksha.db')
cursor = conn.cursor()

# 1. முதலில் டேபிள் சரியாக இருக்கிறதா என உறுதி செய்வோம்
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        sponsor_id TEXT,
        subscription_status TEXT,
        days_remaining INTEGER,
        expiry_date TEXT
    )
''')

# 2. அட்மின் யூசரை உள்ளே நுழைப்போம்
try:
    cursor.execute('''
        INSERT INTO users (name, email, password, sponsor_id, subscription_status, days_remaining)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('Admin User', 'admin@gmail.com', 'admin123', 'DV2026001', 'Active', 30))
    conn.commit()
    print("------------------------------------------")
    print("வெற்றி! அட்மின் யூசர் உருவாக்கப்பட்டது.")
    print("Email: admin@gmail.com")
    print("Password: admin123")
    print("------------------------------------------")
except Exception as e:
    print("குறிப்பு: பயனர் ஏற்கனவே இருக்கலாம் அல்லது பிழை: ", str(e))

conn.close()
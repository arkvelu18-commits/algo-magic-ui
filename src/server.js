const express = require('express');
const cors = require('cors'); // CORS அனுமதிக்கு
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// 1. CORS அனுமதி - இதுதான் பட்டன் ஒர்க் ஆக மிக முக்கியம்
app.use(cors());
app.use(express.json());

// Socket.io செட்டப் (டேஷ்போர்டு டேட்டாவிற்கு)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 2. அல்கோ ஆக்டிவேட் செய்யும் பாதை (API Route)
app.post('/api/activate-algo', (req, res) => {
    console.log("-----------------------------------------");
    console.log("🚀 புதிய ஆக்டிவேஷன் ரிக்வெஸ்ட் வந்துள்ளது!");
    console.log("புரோக்கர்:", req.body.broker);
    console.log("யூசர் ஐடி:", req.body.userId);
    console.log("ஆர்டர் இன்கிரிமெண்ட்:", req.body.orderIncrement);
    console.log("-----------------------------------------");

    // இங்கே உங்கள் அல்கோ இன்ஜினை ஸ்டார்ட் செய்யும் லாஜிக் வரும்
    
    // பதிலைத் திருப்பி அனுப்புதல்
    res.status(200).json({ 
        status: "success", 
        message: "Algo Magic Pro Activated Successfully!",
        receivedData: req.body 
    });
});

// 3. லைவ் டேட்டா சிமுலேஷன் (டேஷ்போர்டுக்காக)
setInterval(() => {
  const mockData = {
    nifty: { lp: (22450 + Math.random() * 10).toFixed(2), change: "+0.45", chartData: [Date.now(), 22445, 22455, 22440, 22450] },
    banknifty: { lp: "48200.50", change: "-0.12" },
    sensex: { lp: "74000.00", change: "+0.30" },
    mtm: (Math.random() * 1000).toFixed(2),
    trades: [
      { id: 1, time: new Date().toLocaleTimeString(), symbol: 'NIFTY 50', type: 'BUY', qty: 50, price: 22445, status: 'COMPLETED' }
    ]
  };
  io.emit('tick', mockData);
}, 2000);

// 4. சர்வர் தொடக்கம்
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ அல்கோ இன்ஜின் தயாராகிவிட்டது! Port: ${PORT}`);
  console.log(`🚀 API: http://localhost:${PORT}/api/activate-algo`);
});
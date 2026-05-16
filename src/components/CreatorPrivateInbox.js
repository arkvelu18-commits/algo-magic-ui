import React, { useState } from 'react';

const CreatorPrivateInbox = () => {
  // இது உங்களுக்கு மட்டும் வரும் மெசேஜ்கள் (Database-லிருந்து வரும்)
  const [inquiries, setInquiries] = useState([
    { id: 1, sender: "Trader_Arun", strategy: "Price Action Pro", message: "அண்ணா, நிஃப்டி ஆப்ஷன்ஸ்க்கு இந்த லாஜிக் செட் ஆகுமா?", time: "10:30 AM", status: "unread" },
    { id: 2, sender: "Kumar_Trader", strategy: "Scalping Magic", message: "SL ரொம்ப அதிகமா இருக்கு, 5 பாயிண்ட் குறைக்கலாமா?", time: "11:15 AM", status: "read" }
  ]);

  const [replyText, setReplyText] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div style={container}>
      <h2 style={{ color: '#00f2ea', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        📩 Creator Message Center (Private)
      </h2>

      <div style={layout}>
        {/* இடது பக்கம்: மெசேஜ் லிஸ்ட் */}
        <div style={sidebar}>
          {inquiries.map(chat => (
            <div key={chat.id} onClick={() => setSelectedChat(chat)} style={{...msgItem, borderLeft: chat.status === 'unread' ? '4px solid #00f2ea' : 'none'}}>
              <div style={{fontWeight: 'bold'}}>{chat.sender}</div>
              <div style={{fontSize: '11px', color: '#8b949e'}}>{chat.strategy}</div>
            </div>
          ))}
        </div>

        {/* வலது பக்கம்: சாட் விண்டோ */}
        <div style={chatArea}>
          {selectedChat ? (
            <>
              <div style={chatHeader}>
                <b>Chat with {selectedChat.sender}</b>
                <span>Strategy: {selectedChat.strategy}</span>
              </div>
              <div style={messageBox}>
                <div style={receivedMsg}>{selectedChat.message}</div>
                {/* நீங்கள் கொடுக்கும் பதில் இங்கே வரும் */}
              </div>
              <div style={inputBox}>
                <input 
                  style={input} 
                  placeholder="பதில் எழுதவும்..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button style={sendBtn} onClick={() => {alert("Reply Sent!"); setReplyText("");}}>SEND</button>
              </div>
            </>
          ) : (
            <div style={emptyState}>மெசேஜை தேர்ந்தெடுத்து பதிலளிக்கவும் அண்ணா!</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const container = { padding: '20px', background: '#0d1117', height: '80vh' };
const layout = { display: 'flex', gap: '20px', height: '100%', marginTop: '20px' };
const sidebar = { flex: 1, background: '#161b22', borderRadius: '10px', overflowY: 'auto' };
const chatArea = { flex: 2.5, background: '#161b22', borderRadius: '10px', display: 'flex', flexDirection: 'column' };
const msgItem = { padding: '15px', borderBottom: '1px solid #333', cursor: 'pointer', hover: {background: '#21262d'} };
const chatHeader = { padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', color: '#00f2ea' };
const messageBox = { flex: 1, padding: '20px', overflowY: 'auto' };
const receivedMsg = { background: '#21262d', padding: '10px 15px', borderRadius: '10px', maxWidth: '70%', alignSelf: 'flex-start' };
const inputBox = { padding: '15px', display: 'flex', gap: '10px', borderTop: '1px solid #333' };
const input = { flex: 1, background: '#0d1117', border: '1px solid #444', color: '#fff', padding: '10px', borderRadius: '5px' };
const sendBtn = { background: '#238636', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '5px', cursor: 'pointer' };
const emptyState = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8b949e' };

export default CreatorPrivateInbox;
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

// நம்முடைய மெமரி கான்டெக்ஸ்ட் இம்போர்ட் செய்கிறோம்
import { AlgoContext } from './AlgoContext';

const Dashboard = () => {
  const chartContainerRef = useRef(null);
  const seriesRef = useRef(null);
  const chartRef = useRef(null);
  const lastCandleRef = useRef(null);

  const { 
    brokerDetails, 
    setBrokerDetails,
    runningIds, 
    setRunningIds
  } = useContext(AlgoContext);

  const [liveStats, setLiveStats] = useState({ pnl: '0.00', price: '0.00', status: 'Ready' });
  const isLoggedIn = runningIds.length > 0;
  
  // 🌐 பேக்-எண்ட் சர்வர் URL செட்டப் (Netlify-க்காக க்ளீன் செய்யப்பட்டது அண்ணா)
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    if (isLoggedIn && liveStats.status === 'Ready') {
      setLiveStats(prev => ({ ...prev, status: 'Running 🚀' }));
    }
  }, [isLoggedIn, liveStats.status]);

  const [activeTab, setActiveTab] = useState('positions');
  const [showSettings, setShowSettings] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('userWatchlist');
    return saved ? JSON.parse(saved) : ['NIFTY 50', 'BANK NIFTY', 'RELIANCE'];
  });

  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [currentTimeframe, setCurrentTimeframe] = useState('5m');
  const [searchTerm, setSearchTerm] = useState('');

  // --- 🎯 ஆப்ஷன் டிரேடிங்கிற்கான லோக்கல் ஸ்டேட்ஸ் ---
  const [strikePrice, setStrikePrice] = useState('22500'); 
  const [optionType, setOptionType] = useState('CE');
  const [orderQty, setOrderQty] = useState(25); 
  const [currentPositionType, setCurrentPositionType] = useState('BUY'); 
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (selectedStock.includes('BANK NIFTY')) {
      setStrikePrice('48500');
      setOrderQty(15); 
    } else if (selectedStock.includes('NIFTY 50') || selectedStock.includes('NIFTY')) {
      setStrikePrice('22500');
      setOrderQty(25); 
    } else if (selectedStock.includes('RELIANCE')) {
      setStrikePrice('2500');
      setOrderQty(250); 
    } else {
      setStrikePrice('1000'); 
      setOrderQty(100);
    }
  }, [selectedStock]);

  useEffect(() => {
    localStorage.setItem('userWatchlist', JSON.stringify(stocks));
  }, [stocks]);

  const fetchHistory = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/history?symbol=${selectedStock}`);
      const data = await response.json();
      
      if (Array.isArray(data) && seriesRef.current) {
        const formattedData = data.map(item => ({
          time: item.time, 
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close)
        }));
        seriesRef.current.setData(formattedData);
        chartRef.current.timeScale().fitContent();
        
        if (formattedData.length > 0) {
          lastCandleRef.current = formattedData[formattedData.length - 1];
        }
      }
    } catch (err) {
      console.error("History loading failed");
    }
  }, [isLoggedIn, selectedStock, BACKEND_URL]);

  const fetchMarketData = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/live_data?symbol=${selectedStock}&tf=${currentTimeframe}`);
      
      if (response.status === 401) {
        setRunningIds([]);
        setLiveStats(prev => ({ ...prev, status: 'Session Expired' }));
        return;
      }

      if (response.ok) {
        const data = await response.json();
        const currentPrice = parseFloat(data.price || '0.00');

        setLiveStats(prev => ({ 
          ...prev,
          price: currentPrice.toFixed(2), 
          pnl: data.mtm || '0.00',
          status: 'Running 🚀'
        }));

        if (seriesRef.current) {
          const now = new Date();
          const candleTime = Math.floor(now.getTime() / 1000 / 60) * 60;

          if (!lastCandleRef.current || lastCandleRef.current.time !== candleTime) {
            const newCandle = {
              time: candleTime, open: currentPrice, high: currentPrice, low: currentPrice, close: currentPrice
            };
            seriesRef.current.update(newCandle);
            lastCandleRef.current = newCandle;
          } else {
            const updatedCandle = {
              ...lastCandleRef.current,
              high: Math.max(lastCandleRef.current.high, currentPrice),
              low: Math.min(lastCandleRef.current.low, currentPrice),
              close: currentPrice
            };
            seriesRef.current.update(updatedCandle);
            lastCandleRef.current = updatedCandle;
          }
        }
      }
    } catch (err) {
      console.log("Live fetch failed");
    }
  }, [isLoggedIn, selectedStock, currentTimeframe, setRunningIds, BACKEND_URL]);

  const handleStartAlgo = async () => {
    if (!brokerDetails.userId || !brokerDetails.password || !brokerDetails.totp || !brokerDetails.clientId) {
      alert("அண்ணா! அனைத்து விவரங்களையும் சரியாக உள்ளிடவும்.");
      setShowSettings(true);
      return;
    }
    setLiveStats(prev => ({ ...prev, status: 'Connecting...' }));
    try {
      const response = await fetch(`${BACKEND_URL}/api/start_algo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedStock, ...brokerDetails })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.stat === 'Ok') {
          setRunningIds([selectedStock]);
          setLiveStats(prev => ({ ...prev, status: 'Running 🚀' }));
          setShowSettings(false);
        } else {
          setRunningIds([]);
          setLiveStats(prev => ({ ...prev, status: 'Login Error' }));
          alert("Zebu Login Error: " + (resData.message || "Unknown error"));
        }
      }
    } catch (err) {
      setLiveStats(prev => ({ ...prev, status: 'Offline' }));
      alert("Backend இணைப்பு இல்லை!");
    }
  };

  const handleStopAlgo = () => {
    setRunningIds([]);
    setLiveStats({ pnl: '0.00', price: '0.00', status: 'Ready' });
  };

  const handleManualOrder = useCallback(async (actionType) => {
    if (!runningIds.length) {
      alert("அண்ணா, முதலில் ZEBU ALGO-வை ஆன் (Start) செய்யவும்!");
      return;
    }
    const fullScript = `${selectedStock} ${strikePrice} ${optionType}`;
    const confirmOrder = window.confirm(`அண்ணா! ${fullScript}-ல் Qty: ${orderQty}-க்கு மேனுவலாக ${actionType} ஆர்டர் போடலாமா?`);
    if (!confirmOrder) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/manual_order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          symbol: selectedStock, 
          strike: strikePrice,
          option_type: optionType,
          quantity: orderQty,
          action: actionType, 
          ...brokerDetails 
        })
      });
      if (response.ok) {
        setCurrentPositionType(actionType); 
        alert(`${actionType} ஆர்டர் வெற்றிகரமாக அனுப்பப்பட்டது அண்ணா!`);
      } else {
        alert("ஆர்டர் தோல்வி அடைந்தது.");
      }
    } catch (err) {
      alert("சர்வரில் ஆர்டர் போட முடியவில்லை!");
    }
  }, [selectedStock, strikePrice, optionType, orderQty, brokerDetails, runningIds, BACKEND_URL]);

  const handleAllSquareOff = async () => {
    if (!isLoggedIn) {
      alert("அல்கோ ரன் ஆகவில்லை அண்ணா!");
      return;
    }
    const confirmSquareOff = window.confirm("⚠️ எச்சரிக்கை அண்ணா! அனைத்து ஓப்பனாக இருக்கும் பொசிஷன்களையும் மூடிவிட்டு (Square Off), அல்கோவை நிறுத்தலாமா?");
    if (!confirmSquareOff) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/square_off_all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brokerDetails })
      });
      if (response.ok) {
        alert("அனைத்து பொசிஷன்களும் வெற்றிகரமாக ஸ்கொயர் ஆஃப் செய்யப்பட்டன அண்ணா! 🛑");
        handleStopAlgo();
      }
    } catch (err) {
      alert("ஸ்கொயர் ஆஃப் செய்வதில் சிக்கல்!");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') {
        return;
      }

      if (event.key === 'B' || event.key === 'b') {
        event.preventDefault();
        handleManualOrder('BUY');
      } else if (event.key === 'S' || event.key === 's') {
        event.preventDefault();
        handleManualOrder('SELL');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleManualOrder]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#070707' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: '#1e222d' }, horzLines: { color: '#1e222d' } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: true, timeVisible: true, secondsVisible: false },
      width: chartContainerRef.current.clientWidth,
      height: 480, 
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#00f2ea', downColor: '#ff4d4d', borderVisible: false,
      wickUpColor: '#00f2ea', wickDownColor: '#ff4d4d',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    if (isLoggedIn) fetchHistory();

    const interval = setInterval(() => {
      if (isLoggedIn) fetchMarketData();
    }, 2000);

    const handleResize = () => {
      if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [isLoggedIn, fetchHistory, fetchMarketData]);

  const handleAddStock = (e) => {
    e.preventDefault();
    const formattedStock = searchTerm.toUpperCase().trim();
    if (formattedStock && !stocks.includes(formattedStock)) {
      setStocks([...stocks, formattedStock]);
      setSearchTerm('');
    }
  };

  const handleRemoveStock = (e, stockToRemove) => {
    e.stopPropagation();
    const newList = stocks.filter(s => s !== stockToRemove);
    setStocks(newList);
    if (selectedStock === stockToRemove && newList.length > 0) setSelectedStock(newList[0]);
  };

  const getStepSize = () => {
    if (selectedStock.includes('BANK NIFTY')) return 15;
    if (selectedStock.includes('NIFTY')) return 25;
    if (selectedStock.includes('RELIANCE')) return 250;
    return 50;
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        <div style={styles.leftColumn}>
          <div style={styles.chartPanel}>
            <div style={styles.chartHeader}>
              <div style={styles.headerLeft}>
                <span style={styles.stockTitle}>{selectedStock}</span>
                <span style={styles.priceText}>₹{liveStats.price}</span>
                <div style={styles.headerTfGroup}>
                  {['1m', '3m', '5m', '15m','30m','1H'].map((tf) => (
                    <button key={tf} onClick={() => setCurrentTimeframe(tf)}
                      style={{...styles.headerTfBtn,
                        backgroundColor: currentTimeframe === tf ? '#00f2ea' : 'transparent',
                        color: currentTimeframe === tf ? '#102a52' : '#8b949e',
                      }}>{tf}</button>
                  ))}
                </div>
              </div>
              <div style={styles.headerRight}>
                <span style={styles.pnlLabel}>P&L: </span>
                <span style={{...styles.pnlValue, color: parseFloat(liveStats.pnl) >= 0 ? '#00f2ea' : '#ff4d4d'}}>
                  ₹{liveStats.pnl}
                </span>
              </div>
            </div>
            <div ref={chartContainerRef} style={{ width: '100%' }} />
            {!isLoggedIn && (
                <div style={styles.overlay}>லாகின் செய்த பின் சார்ட் லோடு ஆகும்...</div>
            )}
          </div>

          <div style={styles.managementPanel}>
            <div style={styles.tabHeaderRow}>
              <div style={styles.tabHeader}>
                <div style={{...styles.tab, color: activeTab === 'positions' ? '#00f2ea' : '#8b949e', borderBottom: activeTab === 'positions' ? '2px solid #00f2ea' : 'none'}} onClick={() => setActiveTab('positions')}>NET POSITIONS</div>
                <div style={{...styles.tab, color: activeTab === 'orders' ? '#00f2ea' : '#8b949e', borderBottom: activeTab === 'orders' ? '2px solid #00f2ea' : 'none'}} onClick={() => setActiveTab('orders')}>ORDER BOOK</div>
              </div>
              
              {activeTab === 'positions' && (
                <div style={styles.manualActionsGroup}>
                  <button style={{...styles.startAllBtn, background: isLoggedIn ? '#57606a' : '#00f2ea'}} onClick={isLoggedIn ? handleStopAlgo : handleStartAlgo}>
                    {isLoggedIn ? '🛑 STOP ALL' : '🚀 START ALL'}
                  </button>
                  <button style={styles.controlSquareOffBtn} onClick={handleAllSquareOff}>⚠️ ALL SQ OFF</button>
                </div>
              )}
            </div>

            <div style={styles.tabContent}>
              {activeTab === 'positions' ? (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={{...styles.th, width: '110px'}}>
                        <input 
                          type="checkbox" 
                          checked={isAllSelected} 
                          onChange={(e) => setIsAllSelected(e.target.checked)}
                          style={{marginRight: '6px', cursor: 'pointer'}}
                        />
                        SELECT ALL
                      </th>
                      <th style={styles.th}>STRIKE PRICE / OPTION</th>
                      <th style={styles.th}>ORDER QTY</th>
                      <th style={styles.th}>TYPE</th>
                      <th style={styles.th}>LTP</th>
                      <th style={styles.th}>P&L</th>
                      <th style={{...styles.th, borderRight: 'none', width: '220px'}}>ACTION</th> 
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={styles.tdRow}>
                      <td style={styles.td}>
                        <input 
                          type="checkbox" 
                          checked={isAllSelected} 
                          onChange={() => {}} 
                          style={{marginRight: '6px'}}
                        />
                        {selectedStock}
                      </td>
                      
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
                          <input 
                            type="number" 
                            value={strikePrice} 
                            onChange={(e) => setStrikePrice(e.target.value)}
                            style={styles.tableInput}
                          />
                          <select 
                            value={optionType} 
                            onChange={(e) => setOptionType(e.target.value)}
                            style={styles.tableSelect}
                          >
                            <option value="CE">CE</option>
                            <option value="PE">PE</option>
                          </select>
                        </div>
                      </td>
                      
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                          <button 
                            style={styles.qtyBtn} 
                            onClick={() => setOrderQty(Math.max(1, orderQty - getStepSize()))}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={orderQty} 
                            onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                            style={styles.qtyInput}
                          />
                          <button 
                            style={styles.qtyBtn} 
                            onClick={() => setOrderQty(orderQty + getStepSize())}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={{
                          ...styles.typeTag, 
                          backgroundColor: currentPositionType === 'BUY' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 83, 83, 0.15)',
                          color: currentPositionType === 'BUY' ? '#4caf50' : '#ef5350',
                          border: currentPositionType === 'BUY' ? '1px solid #4caf50' : '1px solid #ef5350'
                        }}>
                          {currentPositionType === 'BUY' ? '🟢 BUY' : '🔴 SELL'}
                        </span>
                      </td>
                      
                      <td style={styles.td}>₹{liveStats.price}</td>
                      
                      <td style={{...styles.td, fontWeight: 'bold', color: parseFloat(liveStats.pnl) >= 0 ? '#00f2ea' : '#ff4d4d'}}>
                        ₹{liveStats.pnl}
                      </td>
                      
                      <td style={{...styles.td, borderRight: 'none'}}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          <button style={styles.inlineBuyBtn} onClick={() => handleManualOrder('BUY')}>BUY</button>
                          <button style={styles.inlineSellBtn} onClick={() => handleManualOrder('SELL')}>SELL</button>
                          <button style={styles.inlineExitBtn} onClick={handleStopAlgo}>EXIT</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : <div style={{padding: '20px', color: '#8b949e', fontSize: '12px'}}>விவரங்கள் இல்லை.</div>}
            </div>
          </div>
        </div>

        <div style={styles.sidePanel}>
          <div style={styles.watchlistContainer}>
            <div style={styles.panelTitle}>WATCHLIST</div>
            <form onSubmit={handleAddStock}>
              <input type="text" placeholder="Add stock..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.addInput} />
            </form>
            <div style={styles.stockList}>
              {stocks.map((stock) => (
                <div key={stock} onClick={() => setSelectedStock(stock)} style={{...styles.stockItem, color: selectedStock === stock ? '#00f2ea' : '#d1d5db', backgroundColor: selectedStock === stock ? '#1e222d' : 'transparent'}}>
                  <span>{stock}</span>
                  <span onClick={(e) => handleRemoveStock(e, stock)} style={styles.deleteIcon}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{...styles.controlBox, height: showSettings ? 'auto' : '200px', border: isLoggedIn ? '1px solid #00f2ea' : '1px solid #ff4d4d'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={styles.panelTitleAlgo}>ZEBU ALGO SETTINGS</div>
                <button onClick={() => setShowSettings(!showSettings)} style={styles.settingsBtn}>
                   {showSettings ? 'CLOSE ✖' : 'OPEN ⚙️'}
                </button>
              </div>

              {showSettings ? (
                <div style={styles.settingsArea}>
                   <label style={styles.label}>BROKER ID</label>
                   <input type="text" value={brokerDetails?.userId || ''} style={styles.smallInput} onChange={(e) => setBrokerDetails({...brokerDetails, userId: e.target.value})} />
                   <label style={styles.label}>PASSWORD</label>
                   <div style={{position: 'relative'}}>
                    <input type={showPassword ? "text" : "password"} placeholder="Enter Password" style={styles.smallInput} value={brokerDetails?.password || ''} onChange={(e) => setBrokerDetails({...brokerDetails, password: e.target.value})} />
                    <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? '👁️' : '🕶️'}</span>
                   </div>
                   <label style={styles.label}>TOTP SECRET KEY</label>
                   <input type="text" placeholder="Enter Alphabet Key" style={styles.smallInput} value={brokerDetails?.totp || ''} onChange={(e) => setBrokerDetails({...brokerDetails, totp: e.target.value})} />
                   <label style={styles.label}>CLIENT ID (API Key)</label>
                   <input type="text" placeholder="Enter API Key" style={styles.smallInput} value={brokerDetails?.clientId || ''} onChange={(e) => setBrokerDetails({...brokerDetails, clientId: e.target.value})} />
                   <div style={{display: 'flex', gap: '5px'}}>
                      <div style={{flex: 1}}><label style={styles.label}>TARGET</label><input type="number" value={brokerDetails?.profitTarget || ''} style={styles.smallInput} onChange={(e) => setBrokerDetails({...brokerDetails, profitTarget: e.target.value})} /></div>
                      <div style={{flex: 1}}><label style={styles.label}>STOP LOSS</label><input type="number" value={brokerDetails?.stopLoss || ''} style={styles.smallInput} onChange={(e) => setBrokerDetails({...brokerDetails, stopLoss: e.target.value})} /></div>
                   </div>
                </div>
              ) : (
                <div style={styles.statusInfo}>
                  <div style={styles.statusRow}><span>STATUS</span><span style={{color: isLoggedIn ? '#00f2ea' : '#ff4d4d'}}>{liveStats.status}</span></div>
                  <div style={styles.statusRow}><span>USER ID</span><span>{brokerDetails?.userId}</span></div>
                  <div style={styles.statusRow}><span>TARGET</span><span>₹{brokerDetails?.profitTarget}</span></div>
                </div>
              )}

              <button style={{...styles.actionBtn, background: isLoggedIn ? '#57606a' : '#00f2ea'}} onClick={isLoggedIn ? handleStopAlgo : handleStartAlgo}>
                {isLoggedIn ? '🛑 STOP ZEBU ALGO' : '🚀 START ZEBU ALGO'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '10px', background: '#030608', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' },
  mainWrapper: { display: 'flex', gap: '10px', height: 'calc(100% - 20px)' },
  leftColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' },
  chartPanel: { background: '#0d1117', borderRadius: '8px', border: '1px solid #30363d', overflow: 'hidden', position: 'relative' },
  overlay: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#8b949e', fontSize: '14px', zIndex: 10 },
  chartHeader: { padding: '8px 15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e222d' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  stockTitle: { color: '#fff', fontSize: '13px', fontWeight: 'bold' },
  priceText: { color: '#00f2ea', fontSize: '13px' },
  headerTfGroup: { display: 'flex', gap: '5px', marginLeft: '10px' },
  headerTfBtn: { padding: '2px 6px', borderRadius: '4px', fontSize: '9px', cursor: 'pointer', border: '1px solid #30363d' },
  headerRight: { textAlign: 'right' },
  pnlLabel: { color: '#8b949e', fontSize: '10px' },
  pnlValue: { fontSize: '12px', fontWeight: 'bold' },
  managementPanel: { background: '#0d1117', borderRadius: '8px', border: '1px solid #30363d', flex: 1, display: 'flex', flexDirection: 'column' },
  tabHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e222d', paddingRight: '15px' },
  tabHeader: { display: 'flex' },
  tab: { padding: '12px 15px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' },
  manualActionsGroup: { display: 'flex', gap: '8px', alignItems: 'center' },
  startAllBtn: { background: '#00f2ea', color: '#0d1117', padding: '6px 14px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none' },
  controlSquareOffBtn: { background: '#b71c1c', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 8px rgba(211,47,47,0.3)' },
  tabContent: { overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
  thRow: { background: '#161b22', borderBottom: '1px solid #30363d' },
  th: { padding: '12px 10px', fontSize: '11px', color: '#8b949e', borderRight: '1px solid #30363d' },
  tdRow: { borderBottom: '1px solid #30363d' },
  td: { padding: '12px 10px', fontSize: '12px', color: '#fff', verticalAlign: 'middle', borderRight: '1px solid #1e222d' }, 
  typeTag: { padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: 'inline-block' },
  tableInput: { background: '#161b22', border: '1px solid #30363d', color: '#fff', padding: '4px 8px', borderRadius: '4px', width: '80px', fontSize: '12px', textAlign: 'center' },
  tableSelect: { background: '#161b22', border: '1px solid #30363d', color: '#00f2ea', padding: '4px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  qtyBtn: { background: '#21262d', border: '1px solid #30363d', color: '#fff', width: '22px', height: '24px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  qtyInput: { background: '#161b22', border: '1px solid #30363d', color: '#fff', padding: '4px', borderRadius: '4px', width: '50px', fontSize: '12px', textAlign: 'center' },
  inlineBuyBtn: { background: '#1e4620', border: '1px solid #2e7d32', color: '#4caf50', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  inlineSellBtn: { background: '#5c1d1d', border: '1px solid #c62828', color: '#ef5350', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  inlineExitBtn: { background: '#a12222', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  sidePanel: { width: '280px', display: 'flex', flexDirection: 'column', gap: '10px' },
  watchlistContainer: { background: '#0d1117', borderRadius: '8px', border: '1px solid #30363d', padding: '10px', flex: 1, overflow: 'hidden' },
  panelTitle: { color: '#57606a', fontSize: '10px', marginBottom: '8px' },
  addInput: { width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', padding: '6px', color: '#fff', fontSize: '12px' },
  stockList: { marginTop: '10px' },
  stockItem: { padding: '8px', fontSize: '12px', cursor: 'pointer', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' },
  deleteIcon: { color: '#ff4d4d' },
  controlBox: { background: '#0d1117', borderRadius: '8px', padding: '15px', overflowY: 'auto' },
  panelTitleAlgo: { color: '#00f2ea', fontSize: '11px', fontWeight: 'bold' },
  settingsBtn: { background: '#161b22', border: '1px solid #30363d', color: '#8b949e', fontSize: '10px', cursor: 'pointer', padding: '2px 5px' },
  settingsArea: { display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '10px' },
  label: { fontSize: '9px', color: '#8b949e', marginTop: '5px' },
  smallInput: { width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', padding: '7px', color: '#fff', fontSize: '12px' },
  eyeIcon: { position: 'absolute', right: '10px', top: '7px', cursor: 'pointer', fontSize: '12px' },
  statusInfo: { marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' },
  statusRow: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8b949e' },
  actionBtn: { width: '100%', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#0d1117', fontSize: '11px', marginTop: '15px', border: 'none' }
};

export default Dashboard;
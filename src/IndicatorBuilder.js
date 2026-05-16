import React, { useState } from 'react';

const IndicatorBuilder = () => {
    // 1. Technical Builder States
    const [conditions, setConditions] = useState([]);
    const [generatedCode, setGeneratedCode] = useState("");
    const [logicType, setLogicType] = useState("AND");
    const [timeFilter, setTimeFilter] = useState({ start: "09:15", end: "15:30" });
    const [risk, setRisk] = useState({ maxTrades: 3, maxLoss: 5000, maxProfit: 10000 });

    // 2. Algo Options (Index Trigger) States
    const [optionTrigger, setOptionTrigger] = useState({
        index: "NIFTY 50",
        level: "",
        condition: "Is Above ↑",
        action: "BUY CALL (CE)"
    });

    const tools = {
        Indicators: ["EMA", "SMA", "WMA", "RSI", "Bollinger Bands", "ATR"],
        Candlestick: ["Candle Open", "Candle High", "Candle Low", "Candle Close"],
        Operators: ["is above", "is below", "crosses above", "crosses below"]
    };

    const addRule = () => {
        setConditions([...conditions, { 
            id: Date.now(), 
            leftSide: 'Candle Close', 
            operator: 'is below', 
            rightSide: 'Candle Open', 
            shift: 1 
        }]);
    };

    const handleGenerateCode = () => {
        if (conditions.length === 0) {
            alert("தயவுசெய்து ஒரு விதியை உருவாக்கவும்!");
            return;
        }

        const strategyText = conditions.map((rule, i) => {
            const eng = `Rule ${i+1}: IF (${rule.leftSide} Shift ${rule.shift}) ${rule.operator} (${rule.rightSide} Shift ${rule.shift})`;
            const opTamil = rule.operator.includes("above") ? "தாண்டும் போது (அதிகம்)" : "கீழே செல்லும் போது (குறைவு)";
            const tam = `விதி ${i+1}: (${rule.leftSide} S${rule.shift}) ஆனது (${rule.rightSide} S${rule.shift})-ஐ விட ${opTamil}`;
            return `${eng}\n${tam}`;
        }).join(`\n--- ${logicType} ---\n`);

        const fullConfig = `
=========================================
      ALGO MAGIC - STRATEGY CONFIG
=========================================
LOGIC TYPE : ${logicType}
TIME RANGE : ${timeFilter.start} TO ${timeFilter.end}
MAX TRADES : ${risk.maxTrades}
MAX PROFIT : ₹${risk.maxProfit}
MAX LOSS   : ₹${risk.maxLoss}
-----------------------------------------
STRATEGY RULES:
${strategyText}
=========================================
        `;
        setGeneratedCode(fullConfig);
    };

    const handleSetOptionTrigger = () => {
        alert(`🎯 Index Trigger Set: ${optionTrigger.index} ${optionTrigger.condition} ${optionTrigger.level} -> ${optionTrigger.action}`);
        // இங்கே API Call மூலம் algo_magic.py-க்கு டேட்டாவை அனுப்பலாம்
    };

    return (
        <div style={{ padding: '25px', backgroundColor: '#121212', color: '#fff', borderRadius: '15px', maxWidth: '1000px', margin: 'auto' }}>
            <h2 style={{ color: '#f39c12', textAlign: 'center', marginBottom: '20px' }}>🛠️ ALGO MAGIC - ADVANCED LOGIC BUILDER</h2>

            {/* SECTION 1: GLOBAL RISK SETTINGS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' }}>
                <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa' }}>Logic Type</label>
                    <select value={logicType} onChange={(e) => setLogicType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#2c3e50', color: '#fff' }}>
                        <option value="AND">ALL (AND)</option>
                        <option value="OR">ANY (OR)</option>
                    </select>
                </div>
                
                <div style={{ flex: '1 1 180px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#aaa' }}>Trading Time</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input type="time" value={timeFilter.start} onChange={(e) => setTimeFilter({ ...timeFilter, start: e.target.value })} style={{ width: '50%', padding: '5px' }} />
                        <input type="time" value={timeFilter.end} onChange={(e) => setTimeFilter({ ...timeFilter, end: e.target.value })} style={{ width: '50%', padding: '5px' }} />
                    </div>
                </div>

                <div style={{ flex: '1 1 100px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#3498db' }}>Max Trades</label>
                    <input type="number" value={risk.maxTrades} onChange={(e) => setRisk({ ...risk, maxTrades: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #3498db', borderRadius: '4px', backgroundColor: '#121212', color: '#fff' }} />
                </div>

                <div style={{ flex: '1 1 100px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#2ecc71' }}>Max Profit (₹)</label>
                    <input type="number" value={risk.maxProfit} onChange={(e) => setRisk({ ...risk, maxProfit: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #2ecc71', borderRadius: '4px', backgroundColor: '#121212', color: '#fff' }} />
                </div>

                <div style={{ flex: '1 1 100px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#e74c3c' }}>Max Loss (₹)</label>
                    <input type="number" value={risk.maxLoss} onChange={(e) => setRisk({ ...risk, maxLoss: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e74c3c', borderRadius: '4px', backgroundColor: '#121212', color: '#fff' }} />
                </div>
            </div>

            {/* SECTION 2: TECHNICAL ANALYSIS RULES */}
            <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', marginBottom: '30px' }}>
                <h4 style={{ color: '#27ae60', marginTop: 0 }}>📊 Strategy Logic Builder</h4>
                {conditions.map((rule, index) => (
                    <div key={rule.id} style={{ display: 'flex', gap: '10px', padding: '12px', backgroundColor: '#2c3e50', borderRadius: '8px', marginBottom: '10px', alignItems: 'center' }}>
                        <b style={{ color: '#f39c12', minWidth: '25px' }}>R{index + 1}</b>
                        <select style={{ padding: '8px', flex: 1 }} value={rule.leftSide} onChange={(e) => {
                            const n = [...conditions]; n[index].leftSide = e.target.value; setConditions(n);
                        }}>
                            <optgroup label="Candle">{tools.Candlestick.map(c => <option key={c}>{c}</option>)}</optgroup>
                            <optgroup label="Indicator">{tools.Indicators.map(i => <option key={i}>{i}</option>)}</optgroup>
                        </select>
                        <select style={{ padding: '8px', flex: 1 }} value={rule.operator} onChange={(e) => {
                            const n = [...conditions]; n[index].operator = e.target.value; setConditions(n);
                        }}>
                            {tools.Operators.map(op => <option key={op}>{op}</option>)}
                        </select>
                        <select style={{ padding: '8px', flex: 1 }} value={rule.rightSide} onChange={(e) => {
                            const n = [...conditions]; n[index].rightSide = e.target.value; setConditions(n);
                        }}>
                            <optgroup label="Candle">{tools.Candlestick.map(c => <option key={c}>{c}</option>)}</optgroup>
                            <optgroup label="Indicator">{tools.Indicators.map(i => <option key={i}>{i}</option>)}</optgroup>
                        </select>
                        <button onClick={() => setConditions(conditions.filter(c => c.id !== rule.id))} style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px' }}>×</button>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={addRule} style={{ padding: '10px 15px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ ADD RULE</button>
                    <button onClick={handleGenerateCode} style={{ padding: '10px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🚀 GENERATE CODE</button>
                </div>
            </div>

            {/* SECTION 3: ALGO OPTIONS (INDEX TRIGGER) */}
            <div style={{ padding: '25px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '2px solid #3498db' }}>
                <h3 style={{ color: '#3498db', marginTop: 0 }}>🎯 ALGO OPTIONS - INDEX TRIGGER</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 150px' }}>
                        <label style={{ fontSize: '11px', color: '#aaa' }}>Select Index</label>
                        <select value={optionTrigger.index} onChange={(e) => setOptionTrigger({...optionTrigger, index: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#2c3e50', color: '#fff' }}>
                            <option>NIFTY 50</option>
                            <option>BANK NIFTY</option>
                            <option>FIN NIFTY</option>
                        </select>
                    </div>
                    <div style={{ flex: '1 1 150px' }}>
                        <label style={{ fontSize: '11px', color: '#aaa' }}>Trigger Level (Spot)</label>
                        <input type="number" value={optionTrigger.level} onChange={(e) => setOptionTrigger({...optionTrigger, level: e.target.value})} placeholder="Ex: 24000" style={{ width: '100%', padding: '10px', borderRadius: '5px' }} />
                    </div>
                    <div style={{ flex: '1 1 120px' }}>
                        <label style={{ fontSize: '11px', color: '#aaa' }}>Condition</label>
                        <select value={optionTrigger.condition} onChange={(e) => setOptionTrigger({...optionTrigger, condition: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '5px' }}>
                            <option>Is Above ↑</option>
                            <option>Is Below ↓</option>
                        </select>
                    </div>
                    <div style={{ flex: '1 1 150px' }}>
                        <label style={{ fontSize: '11px', color: '#aaa' }}>Action</label>
                        <select value={optionTrigger.action} onChange={(e) => setOptionTrigger({...optionTrigger, action: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#27ae60', color: '#fff' }}>
                            <option>BUY CALL (CE)</option>
                            <option>BUY PUT (PE)</option>
                        </select>
                    </div>
                    <button onClick={handleSetOptionTrigger} style={{ padding: '12px 25px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SET TRIGGER</button>
                </div>
                <p style={{ fontSize: '11px', color: '#5dade2', marginTop: '10px' }}>* அல்கோ தானாகவே அந்த நேரத்துக்கான ATM ஆப்ஷனைத் தேர்ந்தெடுக்கும்.</p>
            </div>

            {/* Final Output */}
            {generatedCode && (
                <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#000', color: '#2ecc71', borderRadius: '10px', border: '1px solid #f39c12' }}>
                    <pre style={{ margin: 0, fontSize: '14px' }}>{generatedCode}</pre>
                </div>
            )}
        </div>
    );
};

export default IndicatorBuilder;
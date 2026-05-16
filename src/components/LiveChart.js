import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { io } from 'socket.io-client';

const LiveChart = () => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const candleSeriesRef = useRef();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. சார்ட் உருவாக்கம்
        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 450,
            layout: { background: { color: '#0b0e11' }, textColor: '#d1d4dc' },
            grid: { vertLines: { color: '#1f2226' }, horzLines: { color: '#1f2226' } },
            timeScale: { timeVisible: true, secondsVisible: true, borderColor: '#485c7b' },
        });

        candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: '#26a69a', 
            downColor: '#ef5350',
            borderVisible: false, 
            wickUpColor: '#26a69a', 
            wickDownColor: '#ef5350',
        });

        // 2. சாக்கெட் இணைப்பு (Python URL சரியாக இருக்கட்டும்)
        const socket = io("http://localhost:5000", {
            transports: ['websocket'],
            upgrade: false
        });

        socket.on('live_data', (serverData) => {
            if (serverData && serverData.price) {
                const currentTime = Math.floor(Date.now() / 1000);
                const price = parseFloat(serverData.price);

                candleSeriesRef.current.update({
                    time: currentTime,
                    open: price,
                    high: price + 0.5,
                    low: price - 0.5,
                    close: price
                });
            }
        });

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            if (chartRef.current) chartRef.current.remove();
        };
    }, []);

    return (
        <div style={{ background: '#0b0e11', padding: '10px', borderRadius: '8px', border: '1px solid #1f2226' }}>
            <h4 style={{color: '#fbbf24', margin: '0 0 10px 0', fontSize: '14px', letterSpacing: '1px'}}>
                LIVE MARKET ENGINE ⚡ <span style={{color: '#26a69a', fontSize: '10px'}}>● CONNECTED</span>
            </h4>
            {/* இங்கே minHeight சேர்ப்பது முக்கியம் */}
            <div ref={chartContainerRef} style={{ width: '100%', minHeight: '450px' }} />
        </div>
    );
};

export default LiveChart;
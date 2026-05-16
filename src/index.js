import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import { AlgoProvider } from './AlgoContext'; // நம்முடைய புதிய மெமரி ஃபைல்

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AlgoProvider> {/* 1. புதிய மெமரி முதலில் ஆப்பை மூடுகிறது */}
      <BrowserRouter> {/* 2. அதற்குள் ரவுட்டிங் ஓடுகிறது */}
        <App />
      </BrowserRouter>
    </AlgoProvider>
  </React.StrictMode>
);
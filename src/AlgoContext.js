import React, { createContext, useState, useEffect } from 'react';

// 1. கான்டெக்ஸ்ட் உருவாக்குதல்
export const AlgoContext = createContext();

export const AlgoProvider = ({ children }) => {
  // பிரௌசர் மெமரியில் ஏற்கனவே டேட்டா இருக்கிறதா என்று செக் செய்து லோடு செய்கிறோம்
  const [runningIds, setRunningIds] = useState(() => {
    const saved = localStorage.getItem('algo_running_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('algo_active_tab');
    return saved ? saved : 'dashboard';
  });

  const [brokerDetails, setBrokerDetails] = useState(() => {
    const saved = localStorage.getItem('algo_broker_details');
    return saved ? JSON.parse(saved) : null;
  });

  // ஸ்டேட்டஸ் மாறும்போது அதைத் தானாகவே பிரௌசர் மெமரியில் (localStorage) சேமிக்கிறோம்
  useEffect(() => {
    localStorage.setItem('algo_running_ids', JSON.stringify(runningIds));
  }, [runningIds]);

  useEffect(() => {
    localStorage.setItem('algo_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('algo_broker_details', JSON.stringify(brokerDetails));
  }, [brokerDetails]);

  // ஒரு குறிப்பிட்ட ஐடியை ஆன் (Run) செய்ய
  const startAlgo = (id) => {
    if (!runningIds.includes(id)) {
      setRunningIds([...runningIds, id]);
    }
  };

  // ஒரு குறிப்பிட்ட ஐடியை ஆஃப் (Stop) செய்ய
  const stopAlgo = (id) => {
    setRunningIds(runningIds.filter(runningId => runningId !== id));
  };

  // அனைத்து ஐடிகளையும் ஒரே கிளிக்கில் ரீசெட்/ஆஃப் செய்ய
  const resetAllAlgos = () => {
    setRunningIds([]);
    localStorage.removeItem('algo_running_ids');
  };

  return (
    <AlgoContext.Provider value={{
      runningIds,
      setRunningIds,
      activeTab,
      setActiveTab,
      brokerDetails,
      setBrokerDetails,
      startAlgo,
      stopAlgo,
      resetAllAlgos
    }}>
      {children}
    </AlgoContext.Provider>
  );
};
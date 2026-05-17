import { createContext, useState, useEffect } from 'react';

// 1. கான்டெக்ஸ்ட் உருவாக்குதல்
export const AlgoContext = createContext();

export const AlgoProvider = ({ children }) => {

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

  useEffect(() => {
    localStorage.setItem('algo_running_ids', JSON.stringify(runningIds));
  }, [runningIds]);

  useEffect(() => {
    localStorage.setItem('algo_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('algo_broker_details', JSON.stringify(brokerDetails));
  }, [brokerDetails]);

  const startAlgo = (id) => {
    if (!runningIds.includes(id)) {
      setRunningIds([...runningIds, id]);
    }
  };

  const stopAlgo = (id) => {
    setRunningIds(runningIds.filter(runningId => runningId !== id));
  };

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
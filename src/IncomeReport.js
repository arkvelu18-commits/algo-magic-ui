import React from 'react';

const IncomeReport = () => {
  // மாதிரி டேட்டா (இதை பின்னர் உங்கள் டேட்டாபேஸுடன் இணைக்கலாம்)
  const incomeData = [
    { id: 1, date: '2026-05-04', type: 'Direct Income', amount: 500, status: 'Credited' },
    { id: 2, date: '2026-05-04', type: 'Level Income', amount: 200, status: 'Credited' },
    { id: 3, date: '2026-05-03', type: 'Daily Ceiling Adjustment', amount: -1500, status: 'Carry Forward' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💰 Income & Payout Report</h2>
      
      {/* வருமானச் சுருக்கம் (Cards) */}
      <div style={styles.summaryGrid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Today's Earnings</p>
          <h3 style={styles.cardValue}>₹ 700</h3>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Pending Carry Forward</p>
          <h3 style={{...styles.cardValue, color: '#c5a059'}}>₹ 1,500</h3>
        </div>
      </div>

      {/* டேட்டா டேபிள் */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {incomeData.map((item) => (
            <tr key={item.id} style={styles.tableRow}>
              <td style={styles.td}>{item.date}</td>
              <td style={styles.td}>{item.type}</td>
              <td style={styles.td}>₹ {item.amount}</td>
              <td style={{...styles.td, color: item.status === 'Credited' ? '#4caf50' : '#ff9800'}}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px', color: '#fff' },
  title: { color: '#c5a059', marginBottom: '30px' },
  summaryGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
  card: { backgroundColor: '#0b1016', padding: '20px', borderRadius: '12px', flex: 1, border: '1px solid #1a1f26' },
  cardLabel: { fontSize: '12px', color: '#666', marginBottom: '5px' },
  cardValue: { fontSize: '24px', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#0b1016', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { backgroundColor: '#1a1f26', textAlign: 'left' },
  th: { padding: '15px', color: '#c5a059', fontWeight: 'bold' },
  td: { padding: '15px', borderBottom: '1px solid #1a1f26' },
  tableRow: { transition: '0.3s', ':hover': { backgroundColor: '#111' } }
};

export default IncomeReport;
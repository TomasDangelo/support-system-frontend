import React, {useContext}  from 'react';
import styles from '../styles/StatsChart.module.css';
import { LanguageContext } from '../context/LanguageContext';

const StatsChart = ({ ticket, color = 'steelblue' }) => {
  const max = Math.max(...ticket.map(d => d.count));
  const {translations} = useContext(LanguageContext); 

  return (
    <div className={styles.chart}>
      {ticket.map((item, index) => (
        <div key={index} className={styles.barContainer}>
        
          <span>
          {translations.statuses[item.status] || translations.priorities[item.label]}
          </span>

          <div className={styles.bar} style={{ width: `${(item.count / max) * 100}%`, backgroundColor: color }}>
            {item.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsChart;

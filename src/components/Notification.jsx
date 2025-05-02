import React, { useEffect, useState } from 'react';
import styles from '../styles/Notification.module.css';

const Notification = ({ message, type= 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  return  <div className={`${styles.notification} ${styles[type]}`}>{message}</div>
};

export default Notification;


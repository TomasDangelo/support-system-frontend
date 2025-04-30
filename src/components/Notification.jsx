import React, { useEffect, useState } from 'react';
import styles from '../styles/Notification.module.css';

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div className={styles.toast}>{message}</div>;
};

export default Notification;


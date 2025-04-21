import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {isMobile && (

          <button className={styles.toggleBtn} onClick={toggleSidebar}>☰</button>

      )}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
        <h2>Soporte</h2>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Mi cuenta</a>
        </nav>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </aside>
    </>
  );
};

export default Sidebar;

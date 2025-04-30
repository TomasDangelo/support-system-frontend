import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const {user} = useContext(AuthContext);
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
    localStorage.removeItem('user');
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
          {user?.role === 'admin' && <a href="/admin">Panel de administrador</a>}
        </nav>
        <button className={styles.logout} onClick={handleLogout}>Cerrar sesión</button>
      </aside>
    </>
  );
};

export default Sidebar;

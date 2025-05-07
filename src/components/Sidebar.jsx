import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import { AuthContext } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { AiOutlineUser  } from "react-icons/ai";
import { FcStatistics } from "react-icons/fc";
import { MdDashboard } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr"
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
        <nav>
        <h2>MyTicket</h2>
          <NavLink to="/dashboard" className={({isActive}) => isActive? styles.activeLink : styles.link}> <MdDashboard />Dashboard </NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive? styles.activeLink : styles.link}> <AiOutlineUser/> Mi cuenta </NavLink>
          <NavLink to="/stats" className={({isActive}) => isActive? styles.activeLink : styles.link}> <FcStatistics /> Estadisticas </NavLink>
          
          {user?.role === 'admin' && <NavLink to="/admin" className={({isActive}) => isActive? styles.activeLink : styles.link}> <GrUserAdmin /> Panel de administrador </NavLink>}
        </nav>
        <button className={styles.logout} onClick={handleLogout}>Cerrar sesión</button>
      </aside>
    </>
  );
};

export default Sidebar;

import React from 'react';
import styles from '../styles/TicketCard.module.css';
import { useNavigate } from 'react-router-dom';

const TicketCard = ({ ticket }) => {
const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/tickets/${ticket.id}`)} className={styles.card}>
      <h3 className={styles.title}>{ticket.subject}</h3>
      <p className={styles.info}>{ticket.message}</p>
      <p className={styles.date}>Creado: {new Date(ticket.created_at).toLocaleString()}</p>
      <div className={styles.meta}>
        <span className={styles.status}>  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
        <span className={styles.priority}> {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
      </div>
    </div>
  );
};

export default TicketCard;

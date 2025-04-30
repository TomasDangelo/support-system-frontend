import React, { useState, useContext } from 'react';
import styles from '../styles/TicketCard.module.css';
import { useNavigate } from 'react-router-dom';
import TicketFormModal from './TicketFormModal';
import { LanguageContext } from '../context/LanguageContext';

const TicketCard = ({ ticket, onUpdate }) => {
const [isEditing, setIsEditing] = useState(false);
const {translations} = useContext(LanguageContext)
const statusClassName = `${styles.status} ${ ticket.status === 'open' || ticket.status === 'in_progress' ? styles.statusOpen :  styles.statusClosed}`

const navigate = useNavigate()
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{ticket.subject}</h3>
      <p className={styles.info}>{ticket.message}</p>
      <p className={styles.date}>{translations.createdAt} {new Date(ticket.created_at).toLocaleString()}</p>
      <div className={styles.meta}>
        <span className={statusClassName}>  {translations.statuses[ticket.status].charAt(0).toUpperCase() + translations.statuses[ticket.status].slice(1)}</span>
        <span className={styles.priority}> {translations.priorities[ticket.priority].charAt(0).toUpperCase() + translations.priorities[ticket.priority].slice(1)}</span>
      </div>
      
      <div className={styles.btnsParent}> 
      <button className={styles.ticketButtons} onClick={() => navigate(`/tickets/${ticket.id}`)}>Ver detalles</button>
      </div>
      <TicketFormModal isOpen={isEditing} onClose={()=> setIsEditing(false)} ticket={ticket} onUpdated={onUpdate} />
    </div>
  );
};

export default TicketCard;

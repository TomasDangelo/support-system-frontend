import React, { useState } from 'react';
import styles from '../styles/TicketCard.module.css';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import TicketFormModal from './TicketFormModal';

const TicketCard = ({ ticket, onUpdate }) => {
const [isEditing, setIsEditing] = useState(false);
const handleClose = async () => {
  try {
    const token =  localStorage.getItem('token');
    await axios.put('/tickets/close', {ticket_id: ticket.id}, {headers: {Authorization: `Bearer ${token}`}})
    onUpdate()
  } catch (error) {
    console.error('Error cerrando ticket:', error);
  }
}
const navigate = useNavigate()
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{ticket.subject}</h3>
      <p className={styles.info}>{ticket.message}</p>
      <p className={styles.date}>Creado: {new Date(ticket.created_at).toLocaleString()}</p>
      <div className={styles.meta}>
        <span className={styles.status}>  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
        <span className={styles.priority}> {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
      </div>
      
      <div className={styles.btnsParent}> 
      <button className={styles.ticketButtons} onClick={() => navigate(`/tickets/${ticket.id}`)}>Ver detalles</button>
      <button className={styles.ticketButtons} onClick={() => setIsEditing(true)}>Editar</button>
        {ticket.status !== 'closed' && (
          <button className={styles.ticketButtons} onClick={handleClose}>Cerrar</button>)}
      </div>
      <TicketFormModal isOpen={isEditing} onClose={()=> setIsEditing(false)} ticket={ticket} onUpdated={onUpdate} />
    </div>
  );
};

export default TicketCard;

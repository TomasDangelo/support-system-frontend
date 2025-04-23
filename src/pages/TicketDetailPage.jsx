import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import styles from '../styles/TicketDetail.module.css';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import TicketFormModal from '../components/TicketFormModal';

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const { translations } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc')

  const handleClose = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/tickets/close', { ticket_id: ticket.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error("Error cerrando:", err);
    }
  };
  
  const handleArchive = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/tickets/update-status', { ticket_id: ticket.id, status: 'archived'}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error("Error archivando:", err);
    }
  };
  
  const toggleSortOrder = () => { setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    const fetchData = async () => {
      try {
        const t = await axios.get(`/tickets/${id}`, { headers });
        const l = await axios.get(`/tickets/logs?ticket_id=${id}`, { headers });
        setTicket(t.data);
        setLogs(l.data);
      } catch (err) {
        console.error('Error cargando detalles:', err);
      }
    };

    fetchData();
  }, [id]);

  if (!ticket) return <p>Error al cargar ticket...</p>;

  return (
    <div className={styles.container}>
      <h1>{translations.ticket} #{ticket.id}</h1>
      <p><strong>{translations.subject}:</strong> {ticket.subject}</p>
      <p><strong>{translations.message}:</strong> {ticket.message}</p>
      <p><strong>{translations.status}:</strong> {translations.statuses[ticket.status] || ticket.status}</p>
      <p><strong>{translations.priority}:</strong> {translations.priorities[ticket.priority] || ticket.priority}</p>
      <p><strong>{translations.createdAt}:</strong> {ticket.created_at}</p>
  <div className={styles.actions}>
      <div className={styles.btnsParent}>
        <button className={styles.ticketButtons} onClick={() => setEditOpen(true)}>{translations.edit}</button>

        {ticket.status !== 'closed' && ( <button className={styles.ticketButtons} onClick={handleClose}>{translations.close}</button> )}

        {ticket.status !== 'archived' && ( <button className={styles.ticketButtons} onClick={handleArchive}>{translations.archive}</button> )}

      </div>
  </div>

        <button className={styles.ticketButtons} onClick={toggleSortOrder}>
          {sortOrder === 'desc' ? translations.sortOldest : translations.sortNewest}
        </button>
<TicketFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} ticket={ticket} onUpdated={() => window.location.reload()}/>
      <h2>{translations.logTitle}</h2>
      <ul className={styles.logList}>
        {logs.length === 0 ? (
          <p>{translations.noLogs}</p>
        ) : (
          (logs.slice().sort((a,b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'desc'? dateB - dateA : dateA - dateB;
          })).map((log, index) => {
            let oldValue = log.old_value;
            let newValue = log.new_value;

            try {
              const parsedOld = JSON.parse(log.old_value);
              const parsedNew = JSON.parse(log.new_value);

              oldValue = `${translations.subject}: ${parsedOld.subject}, ${translations.message}: ${parsedOld.message}`;
              newValue = `${translations.subject}: ${parsedNew.subject}, ${translations.message}: ${parsedNew.message}`;
            } catch (e){
                console.error("Error parseando" , e)
            }

            return (
              <li key={log.id || index} className={styles.logItem}>
                <strong>[{log.created_at}].</strong> {translations.actions[log.action] || log.action}:
                <div className={styles.logChange}>
                  <p>{translations.oldValue}:</p>
                  <p className={styles.oldValue}><em>{oldValue}</em></p>
                  <p> {translations.newValue}: →</p>
                  <p className={styles.newValue}>{newValue}</p>
                </div>
                <hr />
              </li>
            );
          })
        )}
      </ul>
      <button onClick={()=> navigate('/dashboard')}>Volver</button>
    </div>
  );
};

export default TicketDetailPage;

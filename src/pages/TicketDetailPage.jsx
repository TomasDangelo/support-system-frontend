import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import styles from '../styles/TicketDetail.module.css';
import { LanguageContext } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import TicketFormModal from '../components/TicketFormModal';
import Notification from '../components/Notification';

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [note, setNote] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const { translations } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc')

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const isJson = (str) => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      console.error(e)
      return false;
    }
  };
  

  const getUserNameById = (id) => {
    const match = users.find(u => u.id == id);
    return match ? match.name : `ID: ${id}`;
  };
  
  
  const handleClose = async () => {
    try {
      await axios.put('/tickets/update', {
        ticket_id: ticket.id,
        subject: ticket.subject,
        message: ticket.message,
        status: 'closed',
        notes: note, 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Ticket cerrado correctamente');
      setTimeout(() => {
        setMessage(null);
        fetchData();
      }, 3000);
    } catch (err) {
      console.error("Error cerrando:", err);
    }
  };
  
  
 
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

  useEffect(() => {
    fetchData();
  }, [id]);

  const toggleSortOrder = () => { setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc'); };

  const fetchUsers = async() => {
    try {
        const res = await axios.get('/users/all?q=&limit=100&offset=0', { headers })
        setUsers(res.data.users || []);
    } catch (error) {
      console.error('Error cargando usuarios', error);
    }
  }

  useEffect(()=> {

      fetchUsers();
    
  },[ticket])

  const handleAssign = async () => {
    try {
      await axios.put(
        '/tickets/update',
        { ticket_id: ticket.id, subject: ticket.subject, message: ticket.message, status: ticket.status, priority: ticket.priority, assigned_to: assignedUserId},
        { headers }
      );
      setMessage('Ticket asignado correctamente');
      fetchData();
    } catch (err) {
      console.error('Error al asignar ticket', err.response?.data || err.message);
      setMessage('Error al asignar ticket');
    }
  };
  
  if (!ticket) return <p>Error al cargar ticket...</p>;

  return (
    <div className={styles.container}>
      <h1>{translations.ticket} #{ticket.id}</h1>
      <div className={styles.topBtnsParent}>
      <button className={styles.ticketButtons} onClick={() => setEditOpen(true)}>{translations.edit}</button>
  
      <button className={styles.ticketButtons} onClick={()=> navigate('/dashboard')}> ← Volver</button>
      </div>
      <p><strong>{translations.subject}:</strong> {ticket.subject}</p>
      <p><strong>{translations.message}:</strong> {ticket.message}</p>
      <p><strong>{translations.status}:</strong> {translations.statuses[ticket.status] || ticket.status}</p>
      <p><strong>{translations.priority}:</strong> {translations.priorities[ticket.priority] || ticket.priority}</p>
      <p><strong>{translations.createdAt}:</strong> {ticket.created_at}</p>
      <p><strong>Asignado a:</strong> { users.find(u => u.id === ticket.assigned_to)?.name || 'No asignado'}</p>
      <p><strong>Cerrado por:</strong> {ticket.closed_by || '---'}</p>
      <p><strong>Nota de cierre:</strong> {ticket.closing_note || '---'}</p>
      <div className={styles.btnsParent}>

        {ticket.status !== 'closed' && users.length > 0 && (
          <div className={styles.assign}>
          <h3>Asignar a usuario</h3>
          <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
            <option value="">Seleccionar usuario</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          <button className={styles.ticketButtons} onClick={handleAssign}>Asignar</button>
       </div>
      )}
      {ticket.status !== 'closed' && ( 
        <div className={styles.closeParent}>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notas de cierre (opcional)" />
          <button className={styles.ticketButtons} onClick={handleClose}>{translations.close}</button> 
        </div>
        
        )}

      </div>
        {logs.length > 0 && 
        <button className={styles.sortBtn} onClick={toggleSortOrder}>
          {sortOrder === 'desc' ? translations.sortOldest : translations.sortNewest}
        </button>
        }

<TicketFormModal isOpen={editOpen} users={users}  onClose={() => setEditOpen(false)} ticket={ticket} onUpdated={() => window.location.reload()}/>

        {/* Manejo y display de logs */}
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
                 if (log.action === 'update_assigned') {
                   oldValue = getUserNameById(log.old_value);
                   newValue = getUserNameById(log.new_value);
                 } else if (isJson(log.old_value) && isJson(log.new_value)) {
                   const parsedOld = JSON.parse(log.old_value);
                   const parsedNew = JSON.parse(log.new_value);
                   oldValue = `${translations.subject}: ${parsedOld.subject}, ${translations.message}: ${parsedOld.message}`;
                   newValue = `${translations.subject}: ${parsedNew.subject}, ${translations.message}: ${parsedNew.message}`;
                 }
                 else if (log.action === 'close_ticket') {
                  oldValue = translations.status + ": " + translations.closed;
                  newValue = log.note ? translations.note + ": " + log.note : "";
                }
                
                  }                
                 catch (e) {
                 console.error("Error parseando", e);
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

      <Notification message={message} type="success" />
     
    </div>
  );
};

export default TicketDetailPage;

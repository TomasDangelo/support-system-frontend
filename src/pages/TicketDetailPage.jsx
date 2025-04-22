import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import styles from '../styles/TicketDetail.module.css';
import { LanguageContext } from '../context/LanguageContext';

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [logs, setLogs] = useState([]);
  const { translations } = useContext(LanguageContext);

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

      <h2>{translations.logTitle}</h2>
      <ul className={styles.logList}>
        {logs.length === 0 ? (
          <p>{translations.noLogs}</p>
        ) : (
          logs.map((log, index) => {
            let oldValue = log.old_value;
            let newValue = log.new_value;

            try {
              const parsedOld = JSON.parse(log.old_value);
              const parsedNew = JSON.parse(log.new_value);

              oldValue = `${translations.subject}: ${parsedOld.subject}, ${translations.message}: ${parsedOld.message}`;
              newValue = `${translations.subject}: ${parsedNew.subject}, ${translations.message}: ${parsedNew.message}`;
            } catch {
              // En caso de que no sea JSON válido
            }

            return (
              <li key={log.id || index} className={styles.logItem}>
                <strong>[{log.timestamp}]</strong> {translations.actions[log.action] || log.action}:
                <div className={styles.logChange}>
                  <p><em>{oldValue}</em></p>
                  <p>→</p>
                  <p><em>{newValue}</em></p>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default TicketDetailPage;

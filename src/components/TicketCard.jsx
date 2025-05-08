import React, { useContext, useState } from 'react';
import styles from '../styles/TicketTable.module.css'; // reutilizamos el módulo existente
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import TicketFormModal from './TicketFormModal';
import { MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";

const TicketTable = ({ tickets, users, onUpdate }) => {
  const { translations } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getAssignedName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : 'No asignado';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.ticketTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>{translations.subject}</th>
            <th>{translations.priority}</th>
            <th>{translations.status}</th>
            <th>{translations.assignedTo}</th>
            <th>{translations.createdAt}</th>
            <th>{translations.action}</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>#{ticket.id}</td>
              <td>{ticket.subject}</td>
              <td>{translations.priorities[ticket.priority]}</td>
              <td>
              <span className={`${styles.status} ${ticket.status === 'closed'? styles.closed : ticket.status === 'open'? styles.open : ticket.status === 'in_progress'? styles.in_progress : ''}`}>
                    {translations.statuses[ticket.status]}
              </span>
              </td>
              <td>{getAssignedName(ticket.assigned_to)}</td>
              <td>{new Date(ticket.created_at).toLocaleString()}</td>
              <td className={styles.btnsParent}>
                <button className={styles.viewBtn} onClick={() => navigate(`/tickets/${ticket.id}`)}><FaEye /></button>
                <button className={styles.editBtn} onClick={() => {
                  setSelectedTicket(ticket);
                  setIsEditing(true);
                }}><MdEdit /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTicket && (
        <TicketFormModal isOpen={isEditing} onClose={() => setIsEditing(false)} ticket={selectedTicket} users={users} onUpdated={onUpdate}/>
      )}
    </div>
  );
};

export default TicketTable;

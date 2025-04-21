import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TicketCard from '../components/TicketCard';
import styles from '../styles/DashboardPage.module.css';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');

        // Armamos query dinámico
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (priorityFilter !== 'all') params.append('priority', priorityFilter);

        const res = await axios.get(`/tickets/filter?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTickets(res.data);
      } catch (err) {
        console.error('Error cargando tickets:', err);
      }
    };

    fetchTickets();
  }, [statusFilter, priorityFilter]); // Ejecuta cuando cambian

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Tickets</h1>

      <div className={styles.filters}>

        <p>Estado</p>
        <select className={styles.selects} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="open">Abiertos</option>
          <option value="closed">Cerrados</option>
          <option value="archived">Archivados</option>
        </select>
        <p>Prioridad</p>
        <select className={styles.selects} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      <div className={styles.cardsContainer}>
        {tickets.length > 0 ? (
          tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
        ) : (
          <p>No hay tickets que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

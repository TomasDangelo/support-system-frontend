import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TicketCard from '../components/TicketCard';
import styles from '../styles/DashboardPage.module.css';
import TicketFormModal from '../components/TicketFormModal';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewMine, setViewMine] = useState(false);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      //Dependiendo de si viewMine es true, mostramos solo los del usuario o todos
      const url = viewMine ? `/tickets/mine?${params.toString()}` : `/tickets/filter?${params.toString()}`;
  
      const res = await axios.get(url, { headers });
      setTickets(res.data);
    } catch (err) {
      console.error('Error cargando tickets:', err);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, viewMine]); // Ejecuta cuando cambian

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Tickets</h1>
      
      <button onClick={()=> setShowForm(true)}>+ Crear ticket</button>  
      <button className={styles.btnVer} onClick={()=> setViewMine(prev => !prev)}>{viewMine? 'Ver todos': 'Ver solo mis tickets'}</button>
      <TicketFormModal isOpen={showForm} onClose={()=> setShowForm(false)} onUpdated={fetchTickets} />
      <div className={styles.filters}>
        <div className={styles.selectParent}>
          <h4>Estado</h4>
        <select className={styles.selects} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Todos</option>
          <option value="open">Abiertos</option>
          <option value="closed">Cerrados</option>
          <option value="archived">Archivados</option>
        </select>
        </div>
        <div className={styles.selectParent}>
        <h4>Prioridad</h4>
        <select className={styles.selects} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {tickets.length > 0 ? (
          tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} onUpdate={fetchTickets} />)
        ) : (
          <p>No hay tickets que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

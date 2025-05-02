import React, {useEffect, useState } from 'react';
import axios from '../api/axios';
import StatsBarChart from '../components/StatsChart';


const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [resStatus, resPriority] = await Promise.all([
        axios.get('/tickets/stats', { headers }),
        axios.get('/tickets/stats-priority', { headers }) // endpoint adicional
      ]);
      setStats(resStatus.data);
      setPriorityStats(resPriority.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p>Cargando estadísticas...</p>;

  return (
    <div>
      <h2>Estadísticas por estado</h2>
      <StatsBarChart ticket={stats} />

      <h2>Estadísticas por prioridad</h2>
      <StatsBarChart ticket={priorityStats} color="orange" />
    </div>
  );
};

export default StatsPage;

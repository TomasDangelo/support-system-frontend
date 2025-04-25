import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import UserTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminPanel.module.css'

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Debounce: espera 500ms luego de dejar de tipear
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const offset = (page - 1) * 5;
      const res = await axios.get(`/users/all?q=${debouncedQuery}&limit=5&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data.users ?? []);
      setTotalUsers(res.data.total ?? 0);

    } catch (err) {
      console.error('Error cargando usuarios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchUsers();
    }
  }, [debouncedQuery, page]);


    return (
        <div className={styles.panelContainer}>
          <h1 className={styles.panelTitle}>Panel de Administración</h1>
          <input type="text" placeholder="Buscar usuario..." value={query} onChange={e => setQuery(e.target.value)}/>
        
        {loading? (
            <p>Total de usuarios: <strong>{totalUsers}</strong></p>
        ) : (
            <>
            <UserTable users={users} onRoleChange={setUsers} />
          <div className={styles.pagesContainer}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</button>
            <span className={styles.page}>Página {page}</span>
            <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
          </div>
            </>
        )}
        </div>
    )
}

export default AdminPanel;
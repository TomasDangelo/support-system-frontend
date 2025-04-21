import React, {useEffect, useState} from 'react'
import axios from '../api/axios'

const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [roleUpdate, setRoleUpdate] = useState({})
    
    const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`/users/all?q=${search}&limit=5&offset=${(page - 1) * 5}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.error('Error:', err);
        }
      };
    
      useEffect(() => {
        fetchUsers();
      }, [search, page]);
    
      const updateRole = async (id) => {
        const token = localStorage.getItem('token');
        try {
          await axios.patch(`/users/${id}`, {
            role: roleUpdate[id]
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchUsers(); //Vuelve a llamar a fetchUsers para actualizar 
        } catch (err) {
          console.error("Error actualizando rol", err);
        }
      };
    
      return (
        <div>
          <h2>Administrar usuarios</h2>
          <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
    
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.name} ({user.email}) - Rol:
                <select value={roleUpdate[user.id] || user.role} onChange={e => setRoleUpdate({ ...roleUpdate, [user.id]: e.target.value })} >
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
                <button onClick={() => updateRole(user.id)}>Actualizar</button>
              </li>
            ))}
          </ul>
    
          <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Anterior</button>
          <button onClick={() => setPage(prev => prev + 1)}>Siguiente</button>
        </div>
      );
    };

export default UserAdmin

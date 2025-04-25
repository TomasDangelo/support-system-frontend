import React from 'react';
import axios from '../api/axios';
import styles from '../styles/AdminPanel.module.css'; 

const UserTable = ({ users, onRoleChange }) => {
    const handleRoleUpdate = async (userId, newRole) => {
      try {
        const token = localStorage.getItem('token');
        console.log(`Actualizando rol del usuario ${userId} a ${newRole}`);
        await axios.patch(`/users/${userId}`, { role: newRole }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRoleChange(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        alert("Rol actualizado")
      } catch (err) {
        console.error('Error actualizando rol:', err);
      }
    };

  return (
    <table border="1" cellPadding="8" className={styles.tableParent} >
      <thead className={styles.tHead}>
        <tr className={styles.tHead}>
          <th className={styles.rowParent}>Nombre</th>
          <th className={styles.rowParent}>Email</th>
          <th className={styles.rowParent}>Rol</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td className={styles.userData}>{user.name}</td>
            <td className={styles.userData}>{user.email}</td>
            <td className={styles.userData}>
              <select  value={user.role.toLowerCase()} onChange={e => handleRoleUpdate(user.id, e.target.value)}>
                <option id="user" name="user" value="user">Usuario</option>
                <option id="admin" name="admin"value="admin">Admin</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

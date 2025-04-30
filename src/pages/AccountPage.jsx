import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/AccountPage.module.css';

const AccountPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className={styles.accountContainer}>
      <h2>Mi cuenta</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
    </div>
  );
};

export default AccountPage;

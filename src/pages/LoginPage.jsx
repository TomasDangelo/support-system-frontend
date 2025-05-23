import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/LoginPage.module.css'
import useAuth from '../hooks/useAuth'

const LoginPage = () => {

const navigate = useNavigate();
const [form, setForm] = useState({ email: '', password: '' });
const [error, setError] = useState('');
const {login} = useAuth()
const user = localStorage.getItem('user'); 
const handleChange = (e) => {
  const {name, value} = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value
  })); // Funcion generica para actualizar el form, escalable si agregamos más campos
}

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await login(form.email, form.password);
    navigate('/dashboard');
  } catch (e) {
    console.log("Error al hacer login", e)
    setError(e.response?.data?.message || 'Error al iniciar sesión');
  }
};

  return (
    <div className={styles.loginContainer}>
      {user? (
        <div>
          <h4>Bienvenido! </h4>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Iniciar sesion</h2>
        <input name="email" type="email" placeholder='Email' value={form.email} onChange={handleChange} required/>
        <input name="password" type="password" placeholder='Contraseña' value={form.password} onChange={handleChange} required/>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btnSubmit} type='submit'>Ingresar</button>
      </form>

      )}
    </div>
  )
}

export default LoginPage

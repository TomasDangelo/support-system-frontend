import React, { useState, useEffect } from 'react';
import styles from '../styles/TicketFormModal.module.css';
import axios from '../api/axios';

const TicketFormModal = ({isOpen, onClose, ticket = null, onUpdated}) => {
const isEditing = Boolean(ticket); // null o true para diferenciar creacion de edición
const [formData, setFormData] = useState({ subject: '', message: '', priority: 'medium'})

useEffect(()=>{ // Cuando se abre el modal y hay un ticket, seteo los valores
    if (ticket) {
        setFormData({ subject: ticket.subject, message: ticket.message, priority: ticket.priority, })
    }
    else{
        setFormData({ subject: '', message: '', priority: 'medium',})
    }
},[ticket])

const handleChange = e  => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}))
}

const handleSubmit = async e => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token')
        if(isEditing){  //PUT si actualizamos, POST si creamos
            await axios.put('/tickets/update', {ticket_id: ticket.id, ...formData}, {headers: {Authorization: `Bearer ${token}`}})
        }
        else{
            await axios.post('/tickets/create', formData, {headers: {Authorization: `Bearer ${token}`}})
        }
        onUpdated()
        onClose()   // Actualizamos y cerramos el modal
    } catch (error) {
        console.error('Error actualizando ticket:', error)
    }
}

if (!isOpen) return null; //Return temprano en caso de que no este abierto para evitar ejecutar el modal

return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{isEditing? 'Editar Ticket' : 'Nuevo ticket'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Asunto" required />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Descripción" required />
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        </form>
      </div>
    </div>
  );

}

export default TicketFormModal;
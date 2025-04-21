import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const TicketDetail = () => {
    const {id} = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(()=>{
        const fetchTicket = async () =>{
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get(`/tickets/${id}`, {
                    headers: {Authorization: `Bearer ${token}`}
                })
                setTicket(res.data)   
            } catch (error) {
                console.error("No se puede cargar el ticket", error)
            }
        }
        fetchTicket()
    }, [id])

    if(!ticket) return <p>Cargando...</p>


    return (
        <div>
          <h2>Ticket #{ticket.id}</h2>
          <p><strong>Asunto:</strong> {ticket.subject}</p>
          <p><strong>Mensaje:</strong> {ticket.message}</p>
          <p><strong>Estado:</strong> {ticket.status}</p>
          <p><strong>Prioridad:</strong> {ticket.priority}</p>
          <p><strong>Creado en:</strong> {ticket.created_at}</p>
        </div>
      );

}
      export default TicketDetail;
import { createContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
          return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
          console.error("Error parseando user desde localStorage:", e);
          return null;
        }
      });
      

    const login = async (email, password) =>{
        try {
            const {data} = await axios.post('/login.php', {email, password});
            if (!data || !data.token) {
                throw new Error("Respuesta inválida del servidor");
              }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            setUser(data.user);
            
        } catch (error) {
            console.error(error);
        }
    }

    const logout = () =>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

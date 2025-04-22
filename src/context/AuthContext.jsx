import { createContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  let storedUser = null;
  try {
    const parsed = JSON.parse(localStorage.getItem('user'));
    if (parsed && typeof parsed === 'object') storedUser = parsed;
  } catch (e) {
    storedUser = null;
    console.error("Error con el user en localstorage: ", e)
  }
  
  const [user, setUser] = useState(storedUser);
      

    const login = async (email, password) =>{
        try {
            const {data} = await axios.post('/login', {email, password});
            if (!data || !data.token) {
                throw new Error("Respuesta inválida del servidor");
              }
            console.log(data.user)
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

import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost/support-system/api', // Cambiar en el deploy
    headers:{
        'Content-Type' : 'application/json',
    }
})

export default instance;
import axios from "axios";

const api = axios.create({
    baseURL: "https://what-are-we-cooking.onrender.com", 
    withCredentials: true
})

export default api;


import axios from "axios";

// OLD: const LOCAL_BASE_URL = "http://localhost:8080/"; 
// NEW: Points to your live Render backend
const RENDER_BASE_URL = import.meta.env.VITE_API_URL || 'https://exam-portal-server-5gpy.onrender.com';

const springExamAxios = axios.create({
    baseURL: RENDER_BASE_URL
});

export default springExamAxios;
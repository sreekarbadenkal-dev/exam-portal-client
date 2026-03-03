import axios from "axios";

// This points to your Dell G15's Spring Boot server
const LOCAL_BASE_URL = "http://localhost:8080/"; 

const springExamAxios = axios.create({
    baseURL: LOCAL_BASE_URL
});

export default springExamAxios;
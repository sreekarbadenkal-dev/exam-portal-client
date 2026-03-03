import axios from "axios";

const BAseURl="https://online-exam-backend-wxy0.onrender.com/"

const axiosInstance=axios.create({
    baseURL:BAseURl
})

export default axiosInstance;
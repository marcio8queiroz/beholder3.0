import axios from "axios";

axios.interceptors.request.use(
    config => {
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    },
    error => Promise.reject(error)
    
)

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("id");

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }

        return Promise.reject(error.response ? error.response.data : error);
    }       
        
)

export default axios;

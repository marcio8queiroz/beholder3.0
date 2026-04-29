import axios from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export async function doLogin(email, password) {
    const logingUrl = API_URL + "/login";
    const response = await axios.post(logingUrl, { email, password});
    return (await response).data;
}

export async function doLogout() {
     const logingUrl = API_URL + "/logout";
    const response = await axios.post(logingUrl, {});
    return response.data;
}
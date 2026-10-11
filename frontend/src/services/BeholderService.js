import axios from "./BaseService";

const BEHOLDER_URL = `${import.meta.env.VITE_API_URL}/beholder`;

export async function getMemory() {
    const url = BEHOLDER_URL + "/memory";
    const response = await axios.get(url);
    return response.data;
}

export async function getBrain() {
    const url = BEHOLDER_URL + "/brain";
    const response = await axios.get(url);
    return response.data;
}

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

export async function updateMemory(index, value) {
    const url = BEHOLDER_URL + "/memory/" + index;
    const response = await axios.patch(url, { data: value });
    return response.data;
}
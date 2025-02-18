import axios, { AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
    baseURL: "https://localhost:44361/",
}

const api = axios.create(config);

axios.interceptors.request.use(function (config) {
    return config;
}, null);

export default api;
import axios from "axios";
import { AppConst } from "../constants/AppConst";



export const axiosInstance = axios.create({
    baseURL: AppConst.BackendURL,
});

export const axiosProtectedInstance = axios.create({
    baseURL: AppConst.BackendURL,
});
axiosInstance.defaults.timeout = 50*1000;
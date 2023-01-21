import axios from "axios";
import { AppConst } from "../constants/AppConst";



export const axiosInstance = axios.create({
    baseURL: AppConst.BackendURL,
});

export const axiosProtectedInstance = axios.create({
    baseURL: AppConst.BackendURL,
    headers :{
        authorization: `Bearer ${localStorage.getItem("auth")}`
    }
});
axiosInstance.defaults.timeout = 50*1000;
import axios from "axios";
import { AppConst } from "../constants/AppConst";



export const axiosInstance = axios.create({
    baseURL: AppConst.BackendURL,
    timeout: 5000,
});
axiosInstance.defaults.timeout = 50*1000;
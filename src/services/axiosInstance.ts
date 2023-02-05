import axios, { AxiosInstance } from "axios";
import { AppConst } from "../constants/AppConst";



export const axiosInstance = axios.create({
    baseURL: AppConst.BackendURL,
});

class AxiosProtected {
    instance:AxiosInstance;
    constructor(){
        this.instance =  axios.create({
            baseURL: AppConst.BackendURL,
            headers :{
                authorization: `Bearer ${localStorage.getItem("auth")}`
            }});
    }
}

export class AxiosProtectedInstance{
    static axiosProtectedInstance : AxiosInstance;
    getInstance():AxiosInstance{
        if(!AxiosProtectedInstance.axiosProtectedInstance){
            AxiosProtectedInstance.axiosProtectedInstance = new AxiosProtected().instance;
        }
        return AxiosProtectedInstance.axiosProtectedInstance;
    }
}
axiosInstance.defaults.timeout = 50*1000;
import { AxiosResponse } from "axios";
import { ICheckUser, ILogInForm } from "../models/authModels";
import { axiosInstance } from "./axiosInstance";

export const checkUser = async(email: string): Promise<AxiosResponse<ICheckUser>>=>{
    return await axiosInstance.get(`api/v1/auth/checkUserExist/${email}`); 
}

export const changePassword = async(changePasswordReq: ILogInForm):Promise<AxiosResponse<boolean>>=>{
    return await axiosInstance.put("api/v1/auth/changePassword",changePasswordReq);
}
import { AxiosResponse } from "axios";
import { IEmailBody } from "../models/commanModel";
import { AxiosProtectedInstance } from "./axiosInstance";

export const sendEmail = async(emailBody:IEmailBody): Promise<AxiosResponse<boolean>>=>{
    return await new AxiosProtectedInstance().getInstance().post(`api/v1/email/send-email`,emailBody); 
}
import { AxiosResponse } from "axios";
import { IEmailBody } from "../models/commanModel";
import { axiosInstance } from "./axiosInstance";

export const sendEmail = async(emailBody:IEmailBody): Promise<AxiosResponse<boolean>>=>{
    return await axiosInstance.post(`api/v1/email/send-otp`,emailBody); 
}
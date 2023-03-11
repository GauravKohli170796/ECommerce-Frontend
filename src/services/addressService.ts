import { AxiosResponse } from "axios";
import { IAddressInfo } from "../models/addressModel";
import { IUpdateApiResponse } from "../models/commanModel";
import { AxiosProtectedInstance } from "./axiosInstance";

export const fetchUserAddress = async(): Promise<AxiosResponse<IAddressInfo[]>>=>{
    return await new AxiosProtectedInstance().getInstance().get(`api/v1/address/getAllUserAddress`); 
}

export const addUserAddress = async(addressInfo: IAddressInfo): Promise<AxiosResponse<IAddressInfo>>=>{
    return await new AxiosProtectedInstance().getInstance().post(`api/v1/address/addAddress`,addressInfo); 
}

export const updateUserAddress = async(addressId : string,addressInfo: IAddressInfo): Promise<AxiosResponse<IUpdateApiResponse>>=>{
    return await new AxiosProtectedInstance().getInstance().put(`http://localhost:4000/api/v1/address/updateAddress/${addressId}`,addressInfo); 
}
import { AxiosResponse } from "axios";
import { IAddressInfo } from "../models/addressModel";
import { IModelId, IUpdateApiResponse } from "../models/commanModel";
import { axiosProtectedInstance } from "./axiosInstance";

export const fetchUserAddress = async(): Promise<AxiosResponse<IAddressInfo[]>>=>{
    return await axiosProtectedInstance.get(`api/v1/address/getAllUserAddress`); 
}

export const addUserAddress = async(addressInfo: IAddressInfo): Promise<AxiosResponse<IAddressInfo & IModelId>>=>{
    return await axiosProtectedInstance.post(`api/v1/address/addAddress`,addressInfo); 
}

export const updateUserAddress = async(addressId : string,addressInfo: IAddressInfo): Promise<AxiosResponse<IUpdateApiResponse>>=>{
    return await axiosProtectedInstance.put(`api/v1/address/updateAddress/${addressId}`,addressInfo); 
}
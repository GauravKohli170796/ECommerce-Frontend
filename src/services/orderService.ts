import { AxiosResponse } from "axios";
import { IModelId } from "../models/commanModel";
import { IAddOrderRequest, IOrderDetails } from "../models/orderModels";
import { axiosProtectedInstance } from "./axiosInstance";

export const addOrder = async (orderDetails: IAddOrderRequest): Promise<AxiosResponse<IAddOrderRequest & IModelId>> => {
    return await axiosProtectedInstance.post(`api/v1/orders/addOrder`,orderDetails);
};
export const getUserOrders = async (): Promise<AxiosResponse<IOrderDetails[]>>=>{
   return await axiosProtectedInstance.get('/api/v1/orders/getAllUserOrders');
}
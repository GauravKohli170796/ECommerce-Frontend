import { AxiosResponse } from "axios";
import { ordersPerPage } from "../constants/AppConst";
import { IModelId } from "../models/commanModel";
import { IAddOrderRequest, IOrderByStatus, IOrderDetails, IUpdateOrderStatus } from "../models/orderModels";
import { axiosProtectedInstance } from "./axiosInstance";

export const addOrder = async (orderDetails: IAddOrderRequest): Promise<AxiosResponse<IAddOrderRequest & IModelId>> => {
    return await axiosProtectedInstance.post(`api/v1/orders/addOrder`,orderDetails);
};

export const getUserOrders = async (): Promise<AxiosResponse<IOrderDetails[]>>=>{
   return await axiosProtectedInstance.get('/api/v1/orders/getAllUserOrders');
}

export const getOrderByStatus = async (page: string, orderStatus: string): Promise<AxiosResponse<IOrderByStatus>>=>{
    return await axiosProtectedInstance.get(`/api/v1/orders/getAllOrdersByStatus/${ordersPerPage}/${page}/${orderStatus}`);
}

export const updateOrderStatus =  async (orderId: string, updateOrderStatusReq: IUpdateOrderStatus): Promise<AxiosResponse<IOrderDetails>>=>{
    return await axiosProtectedInstance.put(`/api/v1/orders/updateOrderStatus/${orderId}`,updateOrderStatusReq);
} 
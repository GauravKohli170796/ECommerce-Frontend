import { AxiosResponse } from "axios";
import { IModelId } from "../models/commanModel";
import { IAddOrderRequest } from "../models/orderModels";
import { AxiosProtectedInstance } from "./axiosInstance";

export const addOrder = async (orderDetails: IAddOrderRequest): Promise<AxiosResponse<IAddOrderRequest & IModelId>> => {
    return await new AxiosProtectedInstance().getInstance().post(`api/v1/orders/addOrder`,orderDetails);
  };
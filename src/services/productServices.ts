import { AxiosResponse } from "axios";
import { AppConst } from "../constants/AppConst";
import { IAllProductApiResponse, IProduct } from "../models/productModel";
import { axiosInstance } from "./axiosInstance";

export const getAllProducts = async(page:string) : Promise<AxiosResponse<IAllProductApiResponse>> => {
   return await axiosInstance.get(`api/v1/product/${AppConst.productsPerPage}/${parseInt(page)-1}`);  
};

export const getProductById = async (id: string) : Promise<AxiosResponse<IProduct>>=> {
   return await axiosInstance.get(`api/v1/product/${id}`); 
}
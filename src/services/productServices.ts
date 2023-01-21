import { AxiosResponse } from "axios";
import { AppConst } from "../constants/AppConst";
import { IAllProductApiResponse, IProduct } from "../models/productModel";
import { axiosInstance, axiosProtectedInstance } from "./axiosInstance";

export const getAllProducts = async(page:string) : Promise<AxiosResponse<IAllProductApiResponse>> => {
   return await axiosInstance.get(`api/v1/product/${AppConst.productsPerPage}/${parseInt(page)-1}`);  
};

export const getProductById = async (id: string) : Promise<AxiosResponse<IProduct>>=> {
   return await axiosInstance.get(`api/v1/product/${id}`); 
};

export const getWishListItems = async () : Promise<AxiosResponse<IProduct[]>>=> {
   return await axiosProtectedInstance.get(`api/v1/product/getWishListItems`); 
};

export const getCartItems = async () : Promise<AxiosResponse<IProduct[]>>=> {
   return await axiosProtectedInstance.get(`api/v1/product/getWishCartItems`); 
};
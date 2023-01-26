import { AxiosResponse } from "axios";
import { AppConst } from "../constants/AppConst";
import { IDeleteApiResponse } from "../models/commanModel";
import { IAllProductApiResponse, IProduct, IWishListProduct, IWishListProductReq } from "../models/productModel";
import { axiosInstance, axiosProtectedInstance } from "./axiosInstance";

export const getAllProducts = async(page:string) : Promise<AxiosResponse<IAllProductApiResponse>> => {
   return await axiosInstance.get(`api/v1/product/${AppConst.productsPerPage}/${parseInt(page)-1}`);  
};

export const getProductById = async (id: string) : Promise<AxiosResponse<IProduct>>=> {
   return await axiosInstance.get(`api/v1/product/${id}`); 
};

export const getCartItems = async () : Promise<AxiosResponse<IProduct[]>>=> {
   return await axiosProtectedInstance.get(`api/v1/user/getCartItems`); 
};

export const addWishListItem = async(wishListProduct:IWishListProductReq): Promise<AxiosResponse<IWishListProduct>>=>{
   return await axiosProtectedInstance.post('api/v1/user/addWishListItem',wishListProduct);
};

export const getWishListItems = async(): Promise<AxiosResponse<IWishListProduct[]>>=>{
   return await axiosProtectedInstance.get<IWishListProduct[]>('api/v1/user/getWishListItems');
}

export const deleteWishListItems = async(productId: string): Promise<AxiosResponse<IDeleteApiResponse>>=>{
   return await axiosProtectedInstance.delete<IDeleteApiResponse>(`api/v1/user/deleteWishListItem/${productId}`);
}
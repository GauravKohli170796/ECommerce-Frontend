import { AxiosResponse } from "axios";
import { AppConst } from "../constants/AppConst";
import { IDeleteApiResponse, IUpdateApiResponse } from "../models/commanModel";
import { IAllProductApiResponse, ICartProduct, ICartProductReq, IProduct, IWishListProduct, IWishListProductReq } from "../models/productModel";
import { axiosInstance, axiosProtectedInstance } from "./axiosInstance";

export const getAllProducts = async(page:string) : Promise<AxiosResponse<IAllProductApiResponse>> => {
   return await axiosInstance.get(`api/v1/product/${AppConst.productsPerPage}/${parseInt(page)-1}`);  
};

export const getProductById = async (id: string) : Promise<AxiosResponse<IProduct>>=> {
   return await axiosInstance.get(`api/v1/product/${id}`); 
};

export const getAllCategories = async () : Promise<AxiosResponse<string []>>=> {
   return await axiosInstance.get(`api/v1/product/getAllCategories`); 
};

export const addCategory = async (category: string) : Promise<AxiosResponse<unknown>>=> {
   return await axiosInstance.put(`api/v1/product/addNewCategories`,{category : category}); 
};

export const getCartItems = async () : Promise<AxiosResponse<ICartProduct[]>>=> {
   return await axiosProtectedInstance.get(`api/v1/user/getCartItems`); 
};

export const addCartItems = async (cartItem: ICartProductReq) : Promise<AxiosResponse<ICartProduct>>=> {
   return await axiosProtectedInstance.post(`api/v1/user/addCartItem`,cartItem); 
};

export const updateCartItems = async (cartItemId: string, quantity: string | number) : Promise<AxiosResponse<IUpdateApiResponse>>=> {
   return await axiosProtectedInstance.put(`api/v1/user/updateCartItem/${cartItemId}`,{quantity: quantity}); 
};

export const deleteCartItem = async (productId: string) : Promise<AxiosResponse<IDeleteApiResponse>>=> {
   return await axiosProtectedInstance.delete(`api/v1/user/deleteCartItem/${productId}`); 
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
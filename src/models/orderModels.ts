import { sizes } from "../constants/AppConst";
import { IAddressInfo } from "./addressModel";
import { IProduct, orderProductDetails } from "./productModel";

export enum ORDER_STATUS {
    NotAccepted = "Not Accepted",
    Accepted = "Accepted",
    Rejected = "Rejected",
    InProcess = "In Process",
    Dispatched = "Dispatched"
}

export interface IProductDetails {
    productId: string,
    quantity: number,
    price: number,
    color: string,
    size: sizes
}

export interface IAddOrderRequest{
    addressId: string,
    productIds: string[],
    productDetails: IProductDetails[];
    orderStatus?: ORDER_STATUS;
}

interface IOrdersCount{
    totalOrders : number
}

export interface IOrderDetails{
        id: string,
        email: string,
        addressId: IAddressInfo,
        productIds: IProduct[],
        productDetails: orderProductDetails[],
        orderStatus: ORDER_STATUS
}

export interface IOrderByStatus{
    orderDetails: (IOrderDetails & {addressDetails: IAddressInfo[],_id:string})[],
    totalOrders: IOrdersCount[]


}

export interface IUpdateOrderStatus{
    orderStatus: ORDER_STATUS
}
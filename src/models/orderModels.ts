import { SIZES } from "../constants/AppConst";

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
    size: SIZES
}

export interface IAddOrderRequest{
    email: string,
    addressId: string,
    productIds: string[],
    productDetails: IProductDetails[];
    orderStatus?: ORDER_STATUS;
}

export interface IUpdateOrderStatus{
    orderStatus: ORDER_STATUS
}
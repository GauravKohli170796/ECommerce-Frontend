import { SIZES } from "../constants/AppConst";

export interface IProduct {
    _id?: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    discount: number;
    productDetails: any;
    quantity: number;
    category: string;

}

export interface ISearchProduct {
    productId: string
}

interface IProductCount{
    totalProducts : number
}

export interface IAllProductApiResponse{
    latestProduct: IProduct [],
    allProducts: IProduct [],
    totalProducts: IProductCount [],
}

export interface IWishListProductReq{
    productId: string;
}

export interface IWishListProduct{
    _id: string
    productId: {
        _id: string;
        name: string;
        description : string;
        images: string[]
    }
    email: string;
}

export interface ICartProduct{
    _id: string;
    productId: Partial<IProduct> | string;
    email: string;
    quantity: number;
    size: SIZES,
    color: string;
}
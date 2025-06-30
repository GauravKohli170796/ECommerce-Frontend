import { sizes } from "../constants/AppConst";

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
    sizes: string[];
    colors: string []


}
export interface IWalkPadData {
    _id?: string;
    email: string,
    durationMinutes: number | undefined;
    distanceKm: number | undefined;
    caloriesBurned: number | undefined;
    avgSpeedKmph?: number | undefined;
    walkDate:  any;
    walkTime: any;
    note?: string;
    goalDurationMinutes?: number | undefined;
    goalDistanceKm?: number | undefined;
    goalCaloriesBurned?: number | undefined;
    goalStepsWalk?: number | undefined;
}
export interface IGoalData {
    _id?: string;
    email: string,
    goalDurationMinutes: number | undefined;
    goalDistanceKm: number | undefined;
    goalCaloriesBurned: number | undefined;
    goalStepsWalk: number | undefined;
}

export interface ISearchProduct {
    productId: string
}

export interface IAddCategory {
    category: string
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
    productId: {
        _id: string;
        name: string;
        description : string;
        images: string[];
        discount: number;
        price: number
    }
    email: string;
    quantity: number | string;
    size: sizes,
    color: string;
}
export interface ICartProductReq{
    productId: string;
    quantity: string;
    size: string,
    color: string;
}

export interface orderProductDetails{
    productId: string;
    quantity: number;
    size: sizes,
    color: string;
    price: number
}

export interface ISearchresult {
    images: string[],
    price: number,
    name: string,
    _id: string,
    description: string
}
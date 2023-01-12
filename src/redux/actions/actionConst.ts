export interface IAction{
    loading?:boolean
    type: string,
    payload?: any,
    error?:any
}

export enum drawerConst{
    OPEN = "OPEN",
    CLOSE="CLOSE"
}

export enum drawerShowOptions {
    filter = "filter",
    search = "search",
    default= "nothing"
}

export enum eFilterOptionsAction{
    priceSort = "priceSort",
    ratingSort = 'ratingSort',
    price = "price",
    category = 'category',
    reset='reset'
}

export enum eFetchProductsActions{
    loading = "loading",
    success = "success",
    failed = "failed",
}
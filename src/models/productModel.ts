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
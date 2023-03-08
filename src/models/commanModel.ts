export interface IDeleteApiResponse {
    acknowledged: boolean,
    deletedCount: number
}

export interface IUpdateApiResponse {
    acknowledged:boolean,
    modifiedCount:number,
    upsertedCount:number,
    matchedCount:number
}

export interface IFilters{
    price: number []
    categories: string [],
    ratingSort: boolean,
    priceSort: boolean,
    discountSort: boolean
}

export interface ILoginDetails{ 
    token: string
}

export interface IEmailBody {
    email: string;
    type: string;
  }
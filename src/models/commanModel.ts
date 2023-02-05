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
    ratingSort: string,
    priceSort: string
}

export interface ILoginDetails{ 
    token: string
}
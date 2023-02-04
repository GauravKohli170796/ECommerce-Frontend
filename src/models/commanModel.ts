export interface IDeleteApiResponse {
    acknowledged: boolean,
    deletedCount: number
}

export interface IFilters{
    price: number []
    categories: string [],
    ratingSort: string,
    priceSort: string
}
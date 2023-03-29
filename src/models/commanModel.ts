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

export enum EmailTypes {
    SIGNUP = "SIGNUP",
    FORGET_PASSWORD = "FORGET_PASSWORD"
  }

export interface IEmailBody {
    email: string;
    type: EmailTypes;
    otp: string;
  }

  export  interface IModelId {
    _id: string
}
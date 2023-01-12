import { IAction,eFilterOptionsAction } from "../actions/actionConst";
const initialFilterState: {
    price: number[];
    priceSort: string;
    ratingSort: string;
    category: string[];
} = {
    category: [],
    price: [0, 8000],
    priceSort: "",
    ratingSort: ""
};

export const filterReducer = (state = initialFilterState, action: IAction) => {
    switch (action.type) {
        case eFilterOptionsAction.ratingSort:
            return { ...state, ratingSort: action.payload.ratingSort };

        case eFilterOptionsAction.priceSort:
            return { ...state, priceSort: action.payload.priceSort };

        case eFilterOptionsAction.category:
            return { ...state, category: action.payload.category };

        case eFilterOptionsAction.price:
            return { ...state, price: action.payload.price };
        
        case eFilterOptionsAction.reset:
            return initialFilterState;

        default:
            return state;
    }
};
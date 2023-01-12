import { IAction, eFetchProductsActions } from "../actions/actionConst";
const initialProductState={
    latestProduct: [],
    allProducts: [],
    totalProducts: [],
    loading: false,
    error:null
};

export const productReducer = (state = initialProductState, action: IAction) => {
    switch (action.type) {
        case eFetchProductsActions.loading:
            return { ...state, loading: true };

        case eFetchProductsActions.success:
            return { ...state,loading:false, latestProduct: action.payload.latestProduct,allProducts:action.payload.allProducts,totalProducts:action.payload.totalProducts };

        case eFetchProductsActions.failed:
            return { ...state,loading:false,latestProduct:[],allProducts:[],totalProducts:[],error:action.error};

        default:
            return state;
    }
};
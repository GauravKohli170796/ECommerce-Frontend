import { Dispatch } from "redux";
import { getAllProducts } from "../../services/productServices";
import { eFetchProductsActions, IAction } from "./actionConst";

export const fetchProducts = (page:string)=> async (dispatch: Dispatch<IAction>) => {
        dispatch({ type: eFetchProductsActions.loading });
        try {
            const { data } = await getAllProducts(page);
            dispatch({ type: eFetchProductsActions.success, payload: data });
        }
        catch (err: any) {
            dispatch({ type: eFetchProductsActions.failed, error: err.message });
        }

    }


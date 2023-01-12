import { eFetchProductsActions, IAction } from "./actionConst";
import { Dispatch } from "redux";
import { getAllProducts } from "../../services/productServices";

export const fetchProducts = (page:string)=> async (dispatch: Dispatch<IAction>) => {
        dispatch({ type: eFetchProductsActions.loading });
        try {
            const { data } = await getAllProducts(page);
            console.log(data);
            dispatch({ type: eFetchProductsActions.success, payload: data });
        }
        catch (err: any) {
            dispatch({ type: eFetchProductsActions.failed, error: err.message });
        }

    }


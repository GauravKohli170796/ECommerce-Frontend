import { combineReducers, createStore ,applyMiddleware, Store} from "redux";
import { composeWithDevTools } from '@redux-devtools/extension';
import { drawerReducer } from "./reducers/drawerReducer";
import { filterReducer } from "./reducers/filterReducer";
import { productReducer } from "./reducers/productReducer";
import thunk from 'redux-thunk'



const reducer = combineReducers({
    drawer: drawerReducer,
    filter: filterReducer,
    product: productReducer
});

export const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export type rootState = ReturnType<typeof store.getState>;

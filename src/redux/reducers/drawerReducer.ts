import { IAction, drawerConst, drawerShowOptions } from "../actions/actionConst";
const initialDrawerState = {
    isOpen: false,
    drawerShowOption:drawerShowOptions.default

}

export const drawerReducer = (state = initialDrawerState, action: IAction) => {
    switch (action.type) {
        case drawerConst.OPEN:
            return {
                ...state,
                isOpen: true,
                drawerShowOption: action.payload.drawerShowOption
            }
        case drawerConst.CLOSE:
            return {
                ...state,
                isOpen: false,

            }
        default:
            return state;
    }
};
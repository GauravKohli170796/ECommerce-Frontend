import { GetAppState } from '../AppContext';
import { showNotificationMsg } from '../services/createNotification';
import { getCartItems, getWishListItems } from '../services/productServices';

function useCartWishListFetch() {
    const AppState = GetAppState();
    const fetchCartWishListProducts = async() => {

         let wishList = null;
         let cartList = null; 

         const token = localStorage.getItem("auth");
         if(!token){
            showNotificationMsg("*********************************");
            return;
         }
        if (!AppState.wishList) {
           wishList = await fetchWishListProducts();
        }
        else{
            wishList = AppState.wishList;
        }

        if (!AppState.cartList) {
           cartList = await fetchCartProducts();
        }
        else{
            cartList = AppState.cartList;
        }

        return {
            wishList : wishList,
            cartList : cartList

        }
    }

    const fetchWishListProducts = async () => {
        const {data} = await getWishListItems();
        AppState.setWishList(data);
        return data;
    }

    const fetchCartProducts = async () => {
        const {data} = await getCartItems();
        AppState.setCartList(data)
        return data;
    }

    return fetchCartWishListProducts;
}

export default useCartWishListFetch
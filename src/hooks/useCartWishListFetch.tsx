import { GetAppState } from '../AppContext';
import { notificationType } from '../constants/AppConst';
import { AxiosProtectedInstance } from '../services/axiosInstance';
import { showNotificationMsg } from '../services/createNotification';
import { getCartItems, getWishListItems } from '../services/productServices';

function useCartWishListFetch() {
    const AppState = GetAppState();
    const fetchCartWishListProducts = async() => {

         let wishList = null;
         let cartList = null; 

         const token = localStorage.getItem("auth");
         if(!token){
            return;
         }

        if (!AppState.wishList) {
           setAxiosProtectedinstanceInterceptors(); 
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

    const setAxiosProtectedinstanceInterceptors = () =>{
        new AxiosProtectedInstance().getInstance().interceptors.request.use((config) => {
            AppState?.setLoading(true);
            return config;
          }, (error) => {
            return Promise.reject(error);
          });  
          new AxiosProtectedInstance().getInstance().interceptors.response.use(
          response => {
            AppState?.setLoading(false);
            return response
          },
          error => {
            AppState?.setLoading(false);
            showNotificationMsg(error.response?.data?.message || "Something went wrong.", notificationType.DANGER);
          });
    }

    return fetchCartWishListProducts;
}

export default useCartWishListFetch
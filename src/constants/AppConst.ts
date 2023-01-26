export const AppConst = Object.freeze({
   BackendURL: "https://ecommerce-backend-repo-og97.onrender.com/",
   productsPerPage:10
});

export enum drawerShowOptions {
   filter = "filter",
   search = "search",
   menu = "menu",
   default= "nothing"
}

export enum SIZES {
   xs = "Extra Small",
   s = "Small",
   m = "Medium",
   lg = "Large",
   xl = "Extra Large",
   xxl = "Double Extra Large",
   fs = "Free Size"
}

export enum notificationType {
   INFO = "info",
   WARNING = "warning",
   DANGER = "danger",
   SUCCESS= "success"
 }
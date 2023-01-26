import React, { useContext, useMemo, useState } from 'react';
import { drawerShowOptions } from './constants/AppConst';
import { IAllProductApiResponse, IWishListProduct } from './models/productModel';
const AppContext = React.createContext<any>(null);

const AppContextWrapper = ({ children }: any) => {
  const [authDetails, setAuthDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerOption, setDrawerOption] = useState<drawerShowOptions>(drawerShowOptions.default);
  const [initialProducts, setInitialProducts] = useState<IAllProductApiResponse | null>(null);
  const [wishListItems,setWishListItems] = useState<IWishListProduct[]>([]);

  const contextProvider = useMemo(() => ({
    authDetails,
    setAuthDetails,
    loading,
    setLoading,
    openDrawer,
    setOpenDrawer,
    drawerOption,
    setDrawerOption,
    initialProducts,
    setInitialProducts,
    wishListItems,
    setWishListItems,
  }), [authDetails,loading,openDrawer,drawerOption,initialProducts,wishListItems]);

  return <AppContext.Provider value={contextProvider}>
    {children}
  </AppContext.Provider>
}

export const GetAppState = () => {
  return useContext(AppContext);
}

export default AppContextWrapper;
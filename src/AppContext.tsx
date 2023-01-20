import React, { useContext, useMemo, useState } from 'react';
import { drawerShowOptions } from './constants/AppConst';
import { IAllProductApiResponse } from './models/productModel';
const AppContext = React.createContext<any>(null);

const AppContextWrapper = ({ children }: any) => {
  const [authDetails, setAuthDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerOption, setDrawerOption] = useState<drawerShowOptions>(drawerShowOptions.default);
  const [initialProducts, setInitialProducts] = useState<IAllProductApiResponse | null>(null);

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
    setInitialProducts
  }), [authDetails,loading,openDrawer,drawerOption,initialProducts]);

  return <AppContext.Provider value={contextProvider}>
    {children}
  </AppContext.Provider>
}

export const GetAppState = () => {
  return useContext(AppContext);
}

export default AppContextWrapper;
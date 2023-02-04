import React, { useContext, useEffect, useMemo, useState } from 'react';
import { drawerShowOptions, filterInitailValue } from './constants/AppConst';
import { IFilters } from './models/commanModel';
import { IAllProductApiResponse } from './models/productModel';
import { getAllCategories } from './services/productServices';
const AppContext = React.createContext<any>(null);

const AppContextWrapper = ({ children }: any) => {
  const [authDetails, setAuthDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerOption, setDrawerOption] = useState<drawerShowOptions>(drawerShowOptions.default);
  const [initialProducts, setInitialProducts] = useState<IAllProductApiResponse | null>(null);
  const [categories,setCategories] = useState<string[]>([]);
  const [filters,setFilters] = useState<IFilters>(filterInitailValue);

  useEffect(()=>{
     fetchCategories();

     async function fetchCategories(){
      const {data} = await getAllCategories();
      setCategories(data);
     }
  },[])

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
    categories,
    setCategories,
    filters,
    setFilters
  }), [authDetails,loading,openDrawer,drawerOption,initialProducts,categories,filters]);

  return <AppContext.Provider value={contextProvider}>
    {children}
  </AppContext.Provider>
}

export const GetAppState = () => {
  return useContext(AppContext);
}

export default AppContextWrapper;
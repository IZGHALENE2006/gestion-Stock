import { configureStore } from "@reduxjs/toolkit";
import reducerRejister from '../slices/sliceLogin'
import LoginAdminSlic from '../slices/SliceLoginAdmin'
import ProductSlice from '../slices/SliceProduct'
export const Store = configureStore(
    {
        reducer:{
         register:reducerRejister,
         LoginAdmin:LoginAdminSlic,
         Product:ProductSlice
        }
    }
)
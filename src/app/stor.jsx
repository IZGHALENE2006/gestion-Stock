import { configureStore } from "@reduxjs/toolkit";
import reducerRejister from '../slices/sliceLogin'
import LoginAdminSlic from '../slices/SliceLoginAdmin'
export const Store = configureStore(
    {
        reducer:{
         register:reducerRejister,
         LoginAdmin:LoginAdminSlic
        }
    }
)
import { configureStore } from "@reduxjs/toolkit";
import reducerRejister from '../slices/sliceLogin'
export const Store = configureStore(
    {
        reducer:{
         register:reducerRejister
        }
    }
)
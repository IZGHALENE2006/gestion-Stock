import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Login Admin 
export const LoginAdmine = createAsyncThunk('LoginAdmin',async(Admin,{rejectWithValue})=>{
    try{
        const res = await axios.post('http://localhost:7000/LoginAdmin',Admin)
        return res.data
    }catch(error){
          return rejectWithValue(
            error.response?.data?.message || "Server error"
          ) 

    }


})

const initialState = {
  admin: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null
}
const LoginAdminSlice = createSlice(
    {
        name:"LginAdmin",
        initialState:initialState,
         reducers:{
          logoutAdmin:(state)=>{
           state.admin = null;
           state.token = null;
           state.error = null;
           localStorage.removeItem("token");
          }
         },
         extraReducers:(bulder)=>{
          bulder
          .addCase(LoginAdmine.pending,(state,action)=>{
            state.loading = true
            state.error= null
          })
          .addCase(LoginAdmine.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            state.admin = action.payload.admin
            state.token = action.payload.token
            localStorage.setItem('token',action.payload.Token)
          })
           .addCase(LoginAdmine.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        
          })
         }
    }
)
export const {logoutAdmin} = LoginAdminSlice.actions
export default LoginAdminSlice.reducer
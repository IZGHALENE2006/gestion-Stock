import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Login Admin 
export const LoginAdmine = createAsyncThunk('LoginAdmin',async({role,data},{rejectWithValue})=>{
    try{
        const res = await axios.post('http://localhost:7000/aip/adimn/Login',data)
        return res.data
    }catch(error){
          return rejectWithValue(
            error.response?.data?.message || "Server error"
          ) 

    }


})
//Login Admin 
export const GetAdmin = createAsyncThunk('getAdmin',async(_,{rejectWithValue})=>{
  const  token = localStorage.getItem('token')
    try{
        const res = await axios.get('http://localhost:7000/aip/adimn/GetAdmin',{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        return res.data
    }catch(error){
          return rejectWithValue(
            error.response?.data?.message || "Server error"
          ) 

    }


})
const initialState = {
  user: "",
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
            state.token = action.payload.Token
            state.user = action.payload.admin.role
            localStorage.setItem('token',action.payload.Token)
          })
           .addCase(LoginAdmine.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        
          })
          bulder.addCase(GetAdmin.fulfilled,(state,action)=>{
            state.admin = action.payload
      
          })
         }
    }
)
export const {logoutAdmin} = LoginAdminSlice.actions
export default LoginAdminSlice.reducer
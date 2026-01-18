import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Login Admin 
export const Loginuser = createAsyncThunk('LoginAdmin',async({role,data},{rejectWithValue})=>{
    try{
      const url = role ==='admin'?"http://localhost:7000/aip/adimn/Login":"http://localhost:7000/Employe/Login"
        const res = await axios.post(url,data)
        return res.data
    }catch(error){
          return rejectWithValue(
            error.response?.data?.message || "Server error"
          ) 

    }


})
//Login Admin 
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:7000/user/getMe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data; // { role, user }

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error"
      );
    }
  }
);

    ////////////////////////////@@@@@@@@@@@Add Ventes///////////////////
    export const addVentes = createAsyncThunk("addVentes",async(data,{rejectWithValue})=>{
      const Token = localStorage.getItem("token")
      console.log(data);
      
      try{
            const res = await axios.post("http://localhost:7000/addVentes",data,{
            headers:{
                Authorization:`Bearer ${Token}`
           
            }
        })
        return res.data
      }catch(err){
        return rejectWithValue(
            err.response?.data?.message || "Server error"
              
        )
      }
    })
const initialState = {
  user: "",
  role: "",
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
           state.user = null;
           state.token = null;
           state.error = null;
           localStorage.removeItem("token");
          }
         },
         extraReducers:(bulder)=>{
          bulder
          .addCase(Loginuser.pending,(state,action)=>{
            state.loading = true
            state.error= null
          })
          .addCase(Loginuser.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            state.token = action.payload.Token
            state.user = action.payload
            localStorage.setItem('token',action.payload.Token)
          })
           .addCase(Loginuser.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
        
          })
          bulder.addCase(getMe.fulfilled,(state,action)=>{
            state.user = action.payload.user
            state.role = action.payload.role
      
          })
          bulder
.addCase(addVentes.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  if (state.user?.ventes && action.payload?.lastVentes) {
    state.user.ventes.push(...action.payload.lastVentes);
  }
});



         }
    }
)
export const {logoutAdmin} = LoginAdminSlice.actions
export default LoginAdminSlice.reducer
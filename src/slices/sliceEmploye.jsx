import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//create Employe
export const addEmploye = createAsyncThunk("addEmploye",async(Employe,{rejectWithValue})=>{
   const Token = localStorage.getItem("token")
   try{
        const res = await axios.post("http://localhost:7000/Employe/add",Employe,{
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
const initialstate = {
    Employe :[],
    loading:false,
    error:null
}
const SliceEmploye = createSlice(
    {
        name:"employe",
        initialState:initialstate,
        reducers:{},
        extraReducers:(bulder)=>{
            //Add Employe
          bulder
          .addCase(addEmploye.pending,(state)=>{
            state.loading = true
            state.error = null
          })
           .addCase(addEmploye.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            state.Employe.push(action.payload)
          })
          .addCase(addEmploye.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
           
          })
        }
    }
)
export default SliceEmploye.reducer
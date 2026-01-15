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
//GetAllEmploye
export const GetAllEmploye = createAsyncThunk("GetAllEmploye",async(_,{rejectWithValue})=>{
   const Token = localStorage.getItem("token")
   try{
        const res = await axios.get("http://localhost:7000/Employe/get",{
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

//DeleteEmploye
export const DeleteEmploye = createAsyncThunk("DeleteEmploye",async(id,{rejectWithValue})=>{
   const Token = localStorage.getItem("token")
   const iditem  = id
   console.log(iditem);
   
   
   try{
        const res = await axios.delete(`http://localhost:7000/Employe/Delete/${iditem}`,{
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
          //get all Employe 
               bulder
          .addCase(GetAllEmploye.pending,(state)=>{
            state.loading = true
            state.error = null
          })
           .addCase(GetAllEmploye.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            state.Employe =action.payload
          })
          .addCase(GetAllEmploye.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
           
          })

           //DeleteEmploye
               bulder
          .addCase(DeleteEmploye.pending,(state)=>{
            state.loading = true
            state.error = null
          })
           .addCase(DeleteEmploye.fulfilled,(state,action)=>{
            state.loading = false
            state.error = null
            state.Employe =state.Employe.filter((t)=>t._id!==action.payload._id)
          })
          .addCase(DeleteEmploye.rejected,(state,action)=>{
            state.loading = false
            state.error = action.payload
           
          })
        }
    }
)
export default SliceEmploye.reducer
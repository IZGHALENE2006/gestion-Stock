  import { createSlice } from "@reduxjs/toolkit";
  import { createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";

  //create UserCridite
  export const addUserCiridite = createAsyncThunk("addEmploye",async(Date,{rejectWithValue})=>{
    const Token = localStorage.getItem("token")
    try{
          const res = await axios.post("http://localhost:7000/usercridite/add",Date,{
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
  //GetAllUserCridite
  export const GetAllUserCridite = createAsyncThunk("GetAllEmploye",async(_,{rejectWithValue})=>{
    const Token = localStorage.getItem("token")
    try{
          const res = await axios.get("http://localhost:7000/usercridite/get",{
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

  //DeleteUserCridite
  export const DeleteUserCridite = createAsyncThunk("DeleteEmploye",async(id,{rejectWithValue})=>{
    const Token = localStorage.getItem("token")
    const iditem  = id
    console.log(iditem);
    
    
    try{
          const res = await axios.delete(`http://localhost:7000/usercridite/Delete/${iditem}`,{
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
  //UpdateEmploye
    export const UpdateEmploye = createAsyncThunk("UpdateEmploye",async(data,{rejectWithValue})=>{
      const Token = localStorage.getItem("token")
      const {id}  = data
    console.log(data);
    
      
      
      try{
            const res = await axios.put(`http://localhost:7000/Employe/Update/${id}`,data.newinfoEmp,{
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
      UserrCridite :[],
      loading:false,
      error:null
  }
  const SliceCridite = createSlice(
      {
          name:"employe",
          initialState:initialstate,
          reducers:{},
          extraReducers:(bulder)=>{
              //Add Employe
            bulder
            .addCase(addUserCiridite.pending,(state)=>{
              state.loading = true
              state.error = null
            })
            .addCase(addUserCiridite.fulfilled,(state,action)=>{
              state.loading = false
              state.error = null
              state.UserrCridite  .push(action.payload)
            })
            .addCase(addUserCiridite.rejected,(state,action)=>{
              state.loading = false
              state.error = action.payload
            
            })
            //get all Employe 
                bulder
            .addCase(GetAllUserCridite.pending,(state)=>{
              state.loading = true
              state.error = null
            })
            .addCase(GetAllUserCridite.fulfilled,(state,action)=>{
              state.loading = false
              state.error = null
              state.UserrCridite =action.payload
            })
            .addCase(GetAllUserCridite.rejected,(state,action)=>{
              state.loading = false
              state.error = action.payload
            
            })

            //DeleteEmploye
                bulder
            .addCase(DeleteUserCridite.pending,(state)=>{
              state.loading = true
              state.error = null
            })
            .addCase(DeleteUserCridite.fulfilled,(state,action)=>{
              state.loading = false
              state.error = null
              state.Employe =state.Employe.filter((t)=>t._id!==action.payload._id)
            })
            .addCase(DeleteUserCridite.rejected,(state,action)=>{
              state.loading = false
              state.error = action.payload
            
            })

              //UpdateEmploye
                bulder
            .addCase(UpdateEmploye.pending,(state)=>{
              state.loading = true
              state.error = null
            })
            .addCase(UpdateEmploye.fulfilled,(state,action)=>{
              state.loading = false
              state.error = null
    const index = state.Employe.findIndex(t => t._id === action.payload._id);
      if (index !== -1) state.Employe[index] = action.payload;          })
            .addCase(UpdateEmploye.rejected,(state,action)=>{
              state.loading = false
              state.error = action.payload
            
            })
    //                    //addVentes
    //             bulder
    //         .addCase(addVentes.pending,(state)=>{
    //           state.loading = true
    //           state.error = null
    //         })
    //         .addCase(addVentes.fulfilled,(state,action)=>{
    //           state.loading = false
    //           state.error = null
    // const index = state.Employe.findIndex(t => t._id === action.payload._id);
    //   if (index !== -1) state.Employe[index] = action.payload;          })
    //         .addCase(addVentes.rejected,(state,action)=>{
    //           state.loading = false
    //           state.error = action.payload
            
    //         })
          }
      }
  )
  export default SliceCridite.reducer
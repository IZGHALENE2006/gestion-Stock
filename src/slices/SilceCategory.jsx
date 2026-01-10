import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add Caterory
export const AddCategory = createAsyncThunk("AddCategory",async(category,{rejectWithValue})=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.post("http://localhost:7000/Category/Add",category,{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
        
        return res.data
    }catch(error){
        return rejectWithValue(
        error.response?.data?.message || "Server error"
        )
    }
})
//Get All Caterory 
export const GetAllCatefory = createAsyncThunk("GetAllCatefory",async()=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.get("http://localhost:7000/Category/Get",{
            headers:{
                Authorization:`Bearer ${Token}`
            }
        })
       

        return res.data
    }catch(error){
     console.log(error)
     
    }
})


const inialState ={
Category:[],
loading:false,
error:null
}
const SliceCateroy = createSlice(
    {
        name:"Category",
        initialState:inialState,
        reducers:{},
     extraReducers: (builder) => {

  //  Add product
  builder
    .addCase(AddCategory.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(AddCategory.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
    state.Category.push(action.payload);

    })
    .addCase(AddCategory.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

  //  Get all products
  builder
    .addCase(GetAllCatefory.fulfilled, (state, action) => {
      state.Category = action.payload
    })
}

       
        
    }
)
export default SliceCateroy.reducer
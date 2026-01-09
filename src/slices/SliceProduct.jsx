import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add product
export const AddProduct = createAsyncThunk("AddProduct",async(product,{rejectWithValue})=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.post("http://localhost:7000/Product/Add",product,{
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
//Get All Product 
export const GetAllProduct = createAsyncThunk("GetPrudct",async()=>{
    const Token  = localStorage.getItem('token')
    try{
        const res = await axios.get("http://localhost:7000/Product/Get",{
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
Produts:[],
loading:false,
error:null
}
const SliceProduct = createSlice(
    {
        name:"product",
        initialState:inialState,
        reducers:{},
     extraReducers: (builder) => {

  //  Add product
  builder
    .addCase(AddProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(AddProduct.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
    state.Produts.push(action.payload);

    })
    .addCase(AddProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

  //  Get all products
  builder
    .addCase(GetAllProduct.fulfilled, (state, action) => {
      state.Produts = action.payload
    })
}

       
        
    }
)
export default SliceProduct.reducer
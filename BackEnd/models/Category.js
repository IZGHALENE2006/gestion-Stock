import mongoose from "mongoose";

const CategoryShema = new mongoose.Schema(
    {
        idAdmin:Object,
        name:String,
        DateCreate :Date
    }
)
export default mongoose.model('Categories',CategoryShema)
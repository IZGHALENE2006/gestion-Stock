import mongoose from "mongoose";

const AdminShema = new mongoose.Schema(
        {
            name:String,
            email:String,
            password :String
        }
)
export default mongoose.model("Admin",AdminShema)
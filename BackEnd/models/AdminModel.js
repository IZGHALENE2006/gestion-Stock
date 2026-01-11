import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const AdminShema = new mongoose.Schema(
        {
            name:String,
            email:String,
            password :String,
            role:{
              type:String,
              default:"admin"
            }
        }
)
AdminShema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Admin",AdminShema)
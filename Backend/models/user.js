import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: "name is required" },
  password: { type: String, required: "Password is required" },
  email: {
    type: String,
    unique: true,
  },
  phone:Number,
  image:String,
  faceDescriptor:[Number],
  faceEnrolled:{type:Boolean,default:false}
});

userSchema.methods = {
  verify: function (pass) {
    return bcrypt.compareSync(pass, this.password);
  },
};

export const User = mongoose.model("users", userSchema);

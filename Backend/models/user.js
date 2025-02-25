import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: "Name is required" },
  password: { type: String, required: "Password is required" },
  email: {
    type: String,
    unique: true,
  },
  phone: Number,
  image: String,
  faceDescriptor: [Number],
  faceEnrolled: { type: Boolean, default: false },
});

// Define the verify method for comparing passwords
userSchema.methods = {
  verify: function (pass) {
    return bcrypt.compareSync(pass, this.password);
  },
};

// Prevent overwriting the model if it already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };

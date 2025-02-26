import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import distance from "euclidean-distance";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    const user = await User.findOne({ email });

    if (user && user.verify(password)) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        "MY_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return res.status(200).send({ message: "User logged in", token });
    } else {
      return res.status(401).send({ message: "Wrong Email or Password" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

export const register = async (req, res) => {
  console.log("someone trying to register...");
  try {
    const { name, password, email, phone, image } = req.body.data;
    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: "User already exist" });
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      password: encryptedPassword,
      email,
      phone,
      image,
    });
    await newUser.save();

    return res.status(201).send("register successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
};

export const userprofile = async (req, res) => {
  try {
    {
      var user = await User.findById(req.decodedUser.id).select(
        "name email image phone faceEnrolled"
      );

      return res.status(200).send({ message: "Fetched user", user });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
};

export const storeFaceData = async (req, res) => {
  try {
    const { faceDescriptor } = req.body.data;
    const userId = req.decodedUser.id;

    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res.status(400).send({ message: "Invalid face data" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.faceDescriptor = faceDescriptor;
    user.faceEnrolled = true;
    await user.save();

    return res.status(200).send({ message: "Face data stored successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
};

export const verifyFaceWithToken = async (req, res,next) => {
  try {
    const { faceDescriptor } = req.body.data;
    const userId = req.decodedUser.id;

    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res.status(400).send({ message: "Invalid face data" });
    }

    const user = await User.findById(userId);
    if (!user || !user.faceDescriptor) {
      return res.status(404).send({ message: "User face data not found" });
    }

    const dist = distance(user.faceDescriptor, faceDescriptor);
    const threshold = 0.6;

    if (dist < threshold) {
     next()
    } else {
      return res
        .status(401)
        .send({ success: false, message: "Face not recognized" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
};

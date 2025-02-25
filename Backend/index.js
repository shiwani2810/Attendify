import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import userRoute from "./routes/User.js";
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { User } from "./Models/User.js";
import { AttendanceLogs } from "./models/attendanceLogs.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRoute);

app.get("/", (req, res) => {
  console.log(req.query);
  console.log(typeof req.query);

  res.send("Hello " + req.query.name);
});

app.get("/hello", (req, res) => {
  res.send("Hello world");
});

//app.get("/:id", (req, res) => {
//  res.send("reel");
//});

app.post("/register", async (req, res) => {
  console.log("Someone is trying to register...");
  const { name, password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: "User already exist" });

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ name, password: encryptedPassword, email });

    await newUser.save();

    return res.status(201).send("Registered succesfully");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user.verify(password)) {
      const token = jwt.sign({ id: user._id }, "Mysecretkey", {
        expiresIn: "1h",
      });
      return res.status(200).send({ message: "login success", token });
    } else {
      return res.status(401).send({ message: "wrong email or password" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
});

app.get("/userprofile", async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    if (authorization) {
      const decodedUser = await jwt.verify(authorization, "Mysecretkey");
      const user = await User.findById(decodedUser.id).select("name email");

      return res.status(404).send({ message: "Fetched user", user });
    } else {
      return res.status(404).send({ message: "Auth required" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal error", error: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://shiwi2810:Shiwani2810@cluster0.kcmgm.mongodb.net/AttendanceMonitoring?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected");
    AdminJS.registerAdapter({
      Resource:AdminJSMongoose.Resource,
      Database:AdminJSMongoose.Database
    })
    const admin = new AdminJS({
      resources: [User,AttendanceLogs],
    });

    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
    
    app.listen( process.env.PORT || 3000, (err) => {
      if (err) console.log("Error occured" + err);
      else console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

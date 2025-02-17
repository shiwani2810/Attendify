import express from "express";
import { login, register, storeFaceData, userprofile, verifyFaceWithToken } from "../controllers/user.js";
import { verifyLogin } from "../middlewares/index.js";
import { getAttendanceHistory, logAttendance } from "../controllers/attendance.js";

const userRoute = express.Router()

userRoute.post("/login", login)
userRoute.post("/register", register)
userRoute.get("/userprofile", verifyLogin, userprofile)
userRoute.post("/store-face",verifyLogin,storeFaceData)
userRoute.post("/log-attendance",verifyLogin,verifyFaceWithToken,logAttendance)

userRoute.get("/attendance-logs",verifyLogin,getAttendanceHistory)

export default userRoute
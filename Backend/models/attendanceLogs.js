import mongoose from "mongoose";

const attendanceLogsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    image: String,
    location: { lat: Number, lon: Number },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AttendanceLogs = mongoose.model(
  "attendanceLogs",
  attendanceLogsSchema
);

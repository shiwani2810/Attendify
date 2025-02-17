import { AttendanceLogs } from "../models/attendanceLogs.js";

export const logAttendance = async (req, res) => {
  try {
    const { image, location } = req.body.data;
    const user = req.decodedUser;

    if (!user || !image || !location?.lat || !location?.lon) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const attendanceLog = new AttendanceLogs({
      user: user.id,
      image,
      location,
    });

    await attendanceLog.save();

    res
      .status(201)
      .json({ message: "Attendance recorded successfully", attendanceLog });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const user = req.decodedUser;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const attendanceHistory = await AttendanceLogs.find({ user: user.id }).sort(
      { createdAt: -1 }
    );

    if (!attendanceHistory.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res
      .status(200)
      .json({ message: "Attendance history retrieved", attendanceHistory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

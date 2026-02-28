import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "./db";
import User from "./models/User";
import authMiddleware, { AuthRequest } from "./middleware/auth";
import cors from "cors";
import allowRoles from "./middleware/role";
import eventRoutes from "./routes/events";

dotenv.config();




const app = express();
const PORT = 5000;

/* ================= ENV CHECK ================= */
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}
/* ================= MIDDLEWARE ================= */
/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Vite frontend
    credentials: true,
  })
);

app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api", eventRoutes);

/* ================= DB CONNECTION ================= */
connectDB();



/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Geometrica backend is running");
});

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1️⃣ Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required",
      });
    }

    // 2️⃣ Validate role
    if (!["user", "municipality", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // 3️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Save user
    await User.create({
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* ================= LOGIN + JWT ================= */
app.post("/login", async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 4️⃣ Generate JWT (WITH ROLE)
const token = jwt.sign(
  {
    userId: user._id,
    role: user.role, // 👈 ADD THIS LINE
  },
  process.env.JWT_SECRET!,
  { expiresIn: "1h" }
);



    // 5️⃣ Send response
    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* ================= PROTECTED PROFILE ================= */
app.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
app.get(
  "/user/dashboard",
  authMiddleware,
  allowRoles("user"),
  (req, res) => {
    res.json({ message: "Welcome User" });
  }
);

app.get(
  "/municipality/dashboard",
  authMiddleware,
  allowRoles("municipality"),
  (req, res) => {
    res.json({ message: "Welcome Municipality" });
  }
);
app.get(
  "/admin/dashboard",
  authMiddleware,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);


/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

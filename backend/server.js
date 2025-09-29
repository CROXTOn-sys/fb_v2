import express from "express";
import cors from "cors";

const app = express();

// 1️⃣ CORS for Vercel frontend
const corsOptions = {
  origin: "https://fb-v2-eta.vercel.app", // exact frontend URL
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// 2️⃣ Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

// 3️⃣ Your existing routes remain unchanged
app.get("/api/fetch", (req, res) => {
  // your fetch logic here
  res.status(200).json({ message: "Fetch endpoint placeholder" });
});

app.get("/api/download", (req, res) => {
  // your download logic here
  res.status(200).json({ message: "Download endpoint placeholder" });
});

// 4️⃣ Listen on Render port or local 5003
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
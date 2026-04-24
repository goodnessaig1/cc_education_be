import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./db";
import configRoutes from "./routes/config";
import sectionRoutes from "./routes/sections";
import authRoutes from "./routes/auth";
import pagesRoutes from "./routes/pages";
import publishRoutes from "./routes/publish";
import liveRoutes from "./routes/live";
import { authenticate } from "./middleware/auth";
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/config", authenticate, configRoutes);
app.use("/api/sections", authenticate, sectionRoutes);
app.use("/api/pages", authenticate, pagesRoutes);
app.use("/api/publish", authenticate, publishRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/live", liveRoutes);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Initial data is now managed via the sectors API and specialized seed scripts.
});

export { prisma };

const SELF_URL = "https://cc-education-be.onrender.com/";

setInterval(
  async () => {
    try {
      const res = await fetch(SELF_URL);
      if (res.ok) {
        console.log("Keep-alive ping successful ✅");
      } else {
        console.error("Keep-alive ping failed ❌", res.statusText);
      }
    } catch (err) {
      console.error("Keep-alive ping failed ❌");
    }
  },
  5 * 60 * 1000,
);

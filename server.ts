import "express-async-errors";

import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import helmet from "helmet";

// middleware
import { auth, notFound, errorHandler } from "./middleware";
import {
  authRoutes,
  rewardRoutes,
  redemptionRoutes,
  userRoutes,
  materialRoutes,
  activityRoutes,
  mlRoutes,
} from "./routes";

export const app = express();

// middleware
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());

app.use(helmet());
app.use(cors());

app.use("/imgs", express.static("./imgs"));
app.use("/imgs", express.static("./public"));

app.use("/api/v1/auth", authRoutes);

app.use(auth);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/redemptions", redemptionRoutes);
app.use("/api/v1/material", materialRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/classify", mlRoutes);

app.use(notFound);
app.use(errorHandler);

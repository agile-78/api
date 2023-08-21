import "express-async-errors";

import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import helmet from "helmet";

// middleware
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes, userRoutes } from "./routes";

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

// app.use("/imgs", express.static("./imgs"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

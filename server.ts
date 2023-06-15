import "dotenv/config";
import "express-async-errors";

import express from "express";
import cors from "cors";
// @ts-ignore
import xss from "xss-clean";
import { rateLimit } from "express-rate-limit";

import helmet from "helmet";

// middleware
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

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
app.use(xss());

// app.use("/imgs", express.static("./imgs"));

app.use("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use(notFound);
app.use(errorHandler);

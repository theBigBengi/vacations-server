import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.routes";
import vacationsRoutes from "./routes/vacations.routes";
// import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import authRouter from "./routes/auth.routes";
import { AppError } from "./errors/AppError";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./errors/globalErrorHandler";
import hpp from "hpp";
import logRequests from "./middlewares/logRequest.middleware";
import sanitize from "./middlewares/sanitize.middleware";
import {
  camelToSnakeMiddleware,
  snakeToCamelMiddleware,
} from "./middlewares/dataTransformation.middelware";
import CONFIG from "./config";

// Start express app
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  next();
});

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(
  cors({
    origin: CONFIG.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(function (req, res, next) {
  next();
});

// sanitization
app.use(sanitize);

// logger
app.use(logRequests);

//
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);
//

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/images", express.static("public/images"));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "*");
  next();
});

// File upload
app.use(fileUpload());

// Prevent HPP
app.use(hpp());

//
// app.use(camelToSnakeMiddleware);
// //
// app.use(snakeToCamelMiddleware);

app.get("/", (req: any, res: any) => {
  res.send("vacations");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vacations", vacationsRoutes);
app.use("/api/v1/users", usersRouter);

app.use(globalErrorHandler);

export { app };

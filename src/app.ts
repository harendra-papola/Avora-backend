import express from "express";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error/error.middleware";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use((err: any, req: any, res: any, next: any) => {
  console.log("JSON ERROR:", err.message);
  next(err);
});
app.use("/api", userRoutes);
app.use(errorHandler);//should be in the last
export default app;
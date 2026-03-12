import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router.js"
import "dotenv/config";
import { setupCleanup } from "./cleanup.js";

export const app = express();
const PORT = process.env.PORT || 3000;

setupCleanup();

app.use(express.json())
app.use(cookieParser());
app.disable("x-powered-by")
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
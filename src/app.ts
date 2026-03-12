import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router.js"
import "dotenv/config";
import type { Message, Conversation, Session } from "./types/conversation";

export const app = express();
const PORT = process.env.PORT || 3000;

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
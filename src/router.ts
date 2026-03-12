import { Router } from "express"
import rateLimit from "express-rate-limit";
import { askPrompt } from "./controllers/prompt.controller";
import { createSessionId } from "./controllers/session.controller";
import { getConversation, getAllConversations, createConversation, deleteConversation } from "./controllers/conversation.controller";

export const router = Router()

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
});

router.post("/ask", limiter, askPrompt)
router.get("/session", limiter, createSessionId)

router.get("/conversations/:conversationId", getConversation);
router.get("/conversations", getAllConversations);
router.post("/conversation", limiter, createConversation);
router.delete("/conversation/:conversationId", limiter, deleteConversation);
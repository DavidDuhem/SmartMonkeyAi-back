import type { Request, Response } from "express";
import { generateSessionId } from "../utils/generateSessionId";
import { sessions } from "../store/sessions";

export const getConversation = (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;
  const conversationId = Array.isArray(req.params.conversationId) ? req.params.conversationId[0] : req.params.conversationId;

  const conversation = sessionId && sessions[sessionId]?.[conversationId]
    ? sessions[sessionId][conversationId]
    : { conversationId, messages: [] };

  res.json(conversation);
};

export const getAllConversations = (req: Request, res: Response) => {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "lax" });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = { 1: { conversationId: 1, conversationName: "Default Conversation", messages: [], lastActivity: Date.now() } };
  } else {
    if (!sessions[sessionId][1]) {
      sessions[sessionId][1] = { conversationId: 1, conversationName: "Default Conversation", messages: [], lastActivity: Date.now() };
    }
  }

  res.json(sessions[sessionId]);
};

export const createConversation = (req: Request, res: Response) => {
    let sessionId = req.cookies.sessionId;
    const { conversationName } = req.body;

    if (!sessionId || !conversationName) {
        return res.status(400).json({ error: "sessionId et nom de conversation requis" });
    }

    if (!sessions[sessionId]) {
        return res.status(400).json({ error: "Session inexistante" });
    }

    const conversationId = Object.keys(sessions[sessionId]).length + 1;

    sessions[sessionId][conversationId] = {
        conversationId,
        conversationName,
        messages: [],
        lastActivity: Date.now()
    };

    res.json({ conversationId, conversationName });
}

export const deleteConversation = (req: Request, res: Response) => {
    let sessionId = req.cookies.sessionId;
    const conversationId = Number(Array.isArray(req.params.conversationId) ? req.params.conversationId[0] : req.params.conversationId);

    if (!sessionId || !conversationId) {
        return res.status(400).json({ error: "sessionId et nom de conversation requis" });
    }

    const session = sessions[sessionId];

    if (!session || !session[conversationId]) {
        return res.status(404).json({ error: "Conversation introuvable" });
    }

    if (conversationId === 1) {
        return res.status(403).json({ error: "Impossible de supprimer la conversation par défaut" });
    }

    delete session[conversationId];

    return res.sendStatus(200);
}
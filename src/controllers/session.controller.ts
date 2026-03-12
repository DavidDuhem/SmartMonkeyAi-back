import type { Request, Response } from "express";
import { generateSessionId } from "../utils/generateSessionId.js";
import { sessions } from "../store/sessions.js";

export const createSessionId = async (req: Request, res: Response) => {
    let sessionId = req.cookies.sessionId;

    try {
        if (!sessionId) {
            sessionId = generateSessionId();

            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                sameSite: "lax",
            });
        }

        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                1: {
                conversationId: 1,
                conversationName: "Default Conversation",
                messages: [],
                lastActivity: Date.now(),
                },
            };
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur création session" });
    }
};
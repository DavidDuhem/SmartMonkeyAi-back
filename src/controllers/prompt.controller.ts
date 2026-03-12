import type { Request, Response } from "express";
import { generateSessionId } from "../utils/generateSessionId.js";
import { sessions } from "../store/sessions.js";
import { Mistral } from "@mistralai/mistralai";

// Ajouter un message à une conversation
function addMessage(sessionId: string, conversationId: number, prompt: string, response: string) {
    if (!sessions[sessionId]) {
        throw new Error("Session inexistante");
    }

    if (!sessions[sessionId][conversationId]) {
        throw new Error("Conversation inexistante");
    }

    sessions[sessionId][conversationId].messages.push({ prompt, response });
}

export const askPrompt = async (req: Request, res: Response) => {
  const { prompt, conversationId } = req.body;

  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "lax" });
  }


  if (!prompt || !conversationId) return res.status(400).json({ error: "prompt et conversationId requis" });

  try {
    const mistral = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY,
    });

    const result = await mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [
        {
            content: prompt,
            role: "user",
        },
        ],
    })
    
    const messageContent = result.choices?.[0]?.message?.content;
    const content = Array.isArray(messageContent)
    ? messageContent.map(chunk => 'text' in chunk ? chunk.text : '').join('')
    : messageContent || 'Pas de réponse';

    try {
        addMessage(sessionId, conversationId, prompt, content);
    } catch (err) {
        return res.status(400).json({ error: (err as Error).message });
    }

    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
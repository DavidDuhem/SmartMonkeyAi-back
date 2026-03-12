import cron from "node-cron";
import { sessions } from "./store/sessions.js";

export function setupCleanup() {
  cron.schedule("*/10 * * * *", () => {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes en ms

    console.log("Cleaning old conversations...");

    for (const sessionId in sessions) {
      for (const convId in sessions[sessionId]) {
        const conv = sessions[sessionId][convId];

        if (now - conv.lastActivity > maxAge) {
          delete sessions[sessionId][convId];
        }
      }
    }
  });

  console.log("Cleanup cron job initialized");
}
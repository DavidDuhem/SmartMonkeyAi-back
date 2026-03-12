export interface Message {
  prompt: string;
  response: string;
}

export interface Conversation {
  conversationId: number;
  conversationName: string;
  messages: Message[];
}

export interface Session {
  [conversationId: string]: Conversation;
}
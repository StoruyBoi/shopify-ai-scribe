
import { ChatHistoryItem } from "@/types";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "shopify_chat_history";

// Get all chats from localStorage
export const getAllChats = (): ChatHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  const storedChats = localStorage.getItem(STORAGE_KEY);
  return storedChats ? JSON.parse(storedChats) : [];
};

// Create a new chat and add it to history
export const createNewChat = (): ChatHistoryItem => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const newChat: ChatHistoryItem = {
    id: uuidv4(),
    title: "New section",
    date: dateStr
  };
  
  // Add to localStorage
  if (typeof window !== 'undefined') {
    const chats = getAllChats();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newChat, ...chats]));
  }
  
  return newChat;
};

// Update an existing chat
export const updateChat = (chatId: string, updates: Partial<ChatHistoryItem>): void => {
  if (typeof window === 'undefined') return;
  
  const chats = getAllChats();
  const updatedChats = chats.map(chat => 
    chat.id === chatId ? { ...chat, ...updates } : chat
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats));
};

// Delete a chat by ID
export const deleteChat = (chatId: string): void => {
  if (typeof window === 'undefined') return;
  
  const chats = getAllChats();
  const updatedChats = chats.filter(chat => chat.id !== chatId);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats));
};

// Clear all chat history
export const clearAllChats = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

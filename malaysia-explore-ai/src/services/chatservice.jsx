// Handles all chat API calls to Flask backend
import {
  sendMessage as apiSendMessage,
  createNewChatSession as apiCreateNewChatSession,
  fetchSessions as apiFetchSessions,
  getSessionMessages as apiGetSessionMessages,
  switchToSession as apiSwitchToSession
} from '../api';


export async function sendMessage(message) {
  try {
    const response = await apiSendMessage(message);
    return response;
  } catch (error) {
    throw new Error("Failed to send message: " + error.detail);
  }
}


// Create a new chat session
export async function createNewChatSession() {
  try {
    const response = await apiCreateNewChatSession();
    return response;
  } catch (error) {
    throw new Error("Failed to create new chat session: " + error.detail);
  }
}


// Fetch all chat sessions for the user
export async function fetchSessions() {
  try {
    const response = await apiFetchSessions();
    return response;
  } catch (error) {
    throw new Error("Failed to fetch sessions: " + error.detail);
  }
}


// Get all messages for a specific session
export async function getSessionMessages(sessionId) {
  try {
    const response = await apiGetSessionMessages(sessionId);
    return response;
  } catch (error) {
    throw new Error("Failed to get session messages: " + error.detail);
  }
}


// Switch to a different chat session
export async function switchToSession(sessionId) {
  try {
    const response = await apiSwitchToSession(sessionId);
    return response;
  } catch (error) {
    throw new Error("Failed to switch session: " + error.detail);
  }
}






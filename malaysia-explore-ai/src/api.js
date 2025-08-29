// app.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
});

// ---- Signup ----
export const signup = async (formData) => {
  try {
    const response = await API.post("/api/auth/signup", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Signup failed" };
  }
};

// ---- Signin ----
export const signin = async (email) => {
  try {
    const response = await API.post("/api/auth/signin", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Signin failed" };
  }
};

// ---- Chat ----
export const sendMessage = async (message) => {
  try {
    const response = await API.post("/api/chat", { message });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Chat request failed" };
  }
};

export const sendMessageWithToken = async (message, token) => {
  try {
    const response = await API.post("/api/chat", { message, token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Chat request failed" };
  }
};

// ---- Chat sessions (sidebar) ----
export const fetchSessions = async () => {
  try {
    const response = await API.get("/api/chat/sessions");
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to load sessions" };
  }
};

export const fetchSessionsWithToken = async (token) => {
  try {
    const response = await API.get(`/api/chat/sessions`, { params: { token } });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to load sessions" };
  }
};

// ---- Create New Chat Session on clicking new chat button ----
export const createNewChatSession = async () => {
  try {
    const response = await API.post("/api/chat/new_session");
    return response.data; // { session_id: ... }
  } catch (error) {
    throw error.response?.data || { detail: "Failed to create new chat session" };
  }
};


// ---- Get Session Messages ----
export const getSessionMessages = async (sessionId) => {
  try {
    const response = await API.get(`/api/chat/session/${sessionId}/messages`);
    return response.data; // { messages: [...], session_id: ... }
  } catch (error) {
    throw error.response?.data || { detail: "Failed to load session messages" };
  }
};


export const getSessionMessagesWithToken = async (sessionId, token) => {
  try {
    const response = await API.get(`/api/chat/session/${sessionId}/messages`, {
      params: { token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to load session messages" };
  }
};


// ---- Switch to Session ----
export const switchToSession = async (sessionId) => {
  try {
    const response = await API.post(`/api/chat/session/${sessionId}/switch`);
    return response.data; // { session_id: ..., message: ... }
  } catch (error) {
    throw error.response?.data || { detail: "Failed to switch session" };
  }
};


export const switchToSessionWithToken = async (sessionId, token) => {
  try {
    const response = await API.post(`/api/chat/session/${sessionId}/switch`, null, {
      params: { token }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Failed to switch session" };
  }
};




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

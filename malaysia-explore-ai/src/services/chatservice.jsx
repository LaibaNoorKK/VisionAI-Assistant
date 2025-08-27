// Handles all chat API calls to Flask backend
import { sendMessage as apiSendMessage } from '../api';

export async function sendMessage(message) {
  try {
    const response = await apiSendMessage(message);
    return response;
  } catch (error) {
    throw new Error("Failed to send message: " + error.detail);
  }
}

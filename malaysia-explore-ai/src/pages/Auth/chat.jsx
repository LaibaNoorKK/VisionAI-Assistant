import React from "react";
import VisionAIInterface from "../../components/VisionAI/VisionAIInterface";

const Chat = () => {
  // Extract user info from URL query parameters if available
  const urlParams = new URLSearchParams(window.location.search);
  const userToken = urlParams.get('token');
  
  let userName = "User";
  let tokenParam = userToken || "";
  if (userToken) {
    // Parse username from token (format: username-userId)
    const parts = decodeURIComponent(userToken).split('-');
    if (parts.length > 0) {
      userName = parts[0];
    }
  }

  return <VisionAIInterface userName={userName} token={tokenParam} />;
};

export default Chat;

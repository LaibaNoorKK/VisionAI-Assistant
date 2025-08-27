import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { signin } from "../../api"; 
import "../../styles/signup.css";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      // Call axios helper
      const data = await signin(email);

      if (!data.ok) {
        setError(data.error || "Signin failed");
        setLoading(false);
        return;
      }

      const username = data?.username || "";
      const userId = data?.user_id || "";

      // Set authentication token and user data
      const token = `${username}-${userId}`;
      const userData = {
        id: userId,
        name: username,
        email: email
      };
      login(token, userData);
      
      // Navigate to chat with token in query for unique URL
      const encoded = encodeURIComponent(token);
      navigate(`/chat?token=${encoded}`);
    } catch (e) {
      setError(e.detail || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page-container">
      <div className="signin-form-card">
        <h1 className="signin-title">Welcome back</h1>
        <p className="signin-subtitle">Sign in with your email to continue.</p>
        <form onSubmit={onSubmit} className="signin-form">
          <div>
            <input
              id="email"
              type="email"
              placeholder="e.g., you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="signin-input"
            />
          </div>
          {error && <p className="signin-error">{error}</p>}
          <button type="submit" disabled={loading} className="signin-button">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="signup-link-container">
          Don't have an account?{" "}
          <a href="/signup" className="signup-link">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

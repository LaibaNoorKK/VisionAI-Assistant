import React, { useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import "../../styles/signup.css"; 
import { signup } from "../../api"; // ✅ use API wrapper

const STUDY_FIELDS = [
  "10 (E.G. O-level First Year)",
  "11 (E.G. O-level Second Year)",
  "12 (E.G. A-level First Year)",
  "13 (E.G. A-level Second Year)",
];

const UniVisionSignupLanding = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const stepLabels = [
    "Your Name",
    "Your Email",
    "Your Contact Number",
    "Institute name",
    "What you are studying?",
  ];

  const initialData = {
    name: "",
    email: "",
    contact: "",
    institute: "",
    studying: "",
  };

  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const formRef = useRef(null);

  const progress = useMemo(
    () => (step / (stepLabels.length - 1)) * 100,
    [step]
  );

  const onChange = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateEmail = (v) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v);
  const validatePhone = (v) => /^03[0-9]{9}$/.test(v.replace(/\s|-/g, ""));

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!data.name.trim()) e.name = "Your name is required.";
      else if (data.name.trim().length < 4) e.name = "Name must be at least 4 characters.";
    } else if (step === 1) {
      if (!data.institute) e.institute = "Please enter your institute.";
    } else if (step === 2) {
      if (!data.studying) e.studying = "Please select your field of study.";
    } else if (step === 3) {
      if (!data.contact.trim()) e.contact = "Contact number is required.";
      else if (!validatePhone(data.contact)) e.contact = "Enter a valid Pakistani phone number (e.g., 03001234567).";
    } else if (step === 4) {
      if (!data.email.trim()) e.email = "Email is required.";
      else if (!validateEmail(data.email)) e.email = "Enter a valid email address.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < stepLabels.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
  };

  // ✅ Use API.js signup instead of fetch
  const handleFinalSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const result = await signup({
        institute: data.institute,
        studying: data.studying,
        username: data.name,
        contact_number: data.contact,
        email: data.email,
      });

      setIsSubmitting(false);

      if (result?.user_id) {
        setNewUserId(String(result.user_id));
        setSubmitted(true);
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setErrors((e) => ({
          ...e,
          email: result.error || "Signup failed. Please try again.",
        }));
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrors((er) => ({
        ...er,
        email: err.detail || "Network error. Please try again.",
      }));
    }
  };

  const handleBeginChat = () => {
    // Set authentication token and user data
    const token = `${data.name}-${newUserId}`;
    const userData = {
      id: newUserId,
      name: data.name,
      email: data.email
    };
    login(token, userData);
    
    // Navigate to chat with token in query for unique URL
    const encoded = encodeURIComponent(token);
    navigate(`/chat?token=${encoded}`);
  };

  return (
    <div className="signup-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="text-content">
          <h1 className="hero-title">UniVision: Your Admission Partner</h1>
          <p className="hero-subtitle">
            Helping students explore universities and stay ahead of admissions timelines.
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <section className="signup-section">
        <div className="signup-card-container" ref={formRef}>
          <div className="signup-card">
            <div className="card-header">
              <h2 className="card-title">Join UniVision</h2>
              <p className="card-subtitle">
                Get personalized admission updates for your dream university
              </p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-text">
                <span>
                  Step {step + 1} of {stepLabels.length}
                </span>
                <span>
                  {Math.round(((step + 1) / stepLabels.length) * 100)}%
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="card-content">
              {/* Step 1: Name */}
              {step === 0 && (
                <div className="step-content">
                  <div className="step-header">
                    <h2 className="step-title">What should we call you?</h2>
                    <p className="step-subtitle">Choose a username that represents you</p>
                  </div>
                  <div className="form-group">
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => onChange("name", e.target.value)}
                      placeholder="Enter your username"
                      className={`form-input ${errors.name ? "input-error" : ""}`}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Institute */}
              {step === 1 && (
                <div className="step-content">
                  <div className="step-header">
                    <h2 className="step-title">Which institute do you attend?</h2>
                    <p className="step-subtitle">Select your current educational institute</p>
                  </div>
                  <div className="form-group">
                    <input
                        id="institute"
                        type="text"
                        value={data.institute}
                        onChange={(e) => onChange("institute", e.target.value)}
                        placeholder="Enter your institute name"
                        className={`form-input ${errors.institute ? "input-error" : ""}`}
                      />
                    {errors.institute && <p className="error-message">{errors.institute}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Field of Study */}
              {step === 2 && (
                <div className="step-content">
                  <div className="step-header">
                    <h2 className="step-title">What are you studying?</h2>
                    <p className="step-subtitle">Tell us about your field of study</p>
                  </div>
                  <div className="form-group">
                    <select
                      id="studying"
                      value={data.studying}
                      onChange={(e) => onChange("studying", e.target.value)}
                      className={`form-select ${errors.studying ? "input-error" : ""}`}
                    >
                      <option value="" disabled>Select your field of study</option>
                      {STUDY_FIELDS.map((field) => (
                        <option key={field} value={field} className="form-select-option">
                          {field}
                        </option>
                      ))}
                    </select>
                    {errors.studying && <p className="error-message">{errors.studying}</p>}
                  </div>
                </div>
              )}
               {/* Step 4: Contact Number */}
               {step === 3 && (
                <div className="step-content">
                  <div className="step-header">
                    <h2 className="step-title">How can we reach you?</h2>
                    <p className="step-subtitle">Your contact number for important updates</p>
                  </div>
                  <div className="form-group phone-input-group">
                      <input
                      id="contact"
                      type="tel"
                      value={data.contact}
                      onChange={(e) => onChange("contact", e.target.value)}
                      placeholder="03001234567"
                      className={`form-input phone-input ${errors.contact ? "input-error" : ""}`}
                      maxLength={11}
                    />
                    {errors.contact && <p className="error-message">{errors.contact}</p>}
                  </div>
                </div>
              )}
              {/* Step 5: Email */}
              {step === 4 && (
                <div className="step-content">
                  <div className="step-header">
                    <h2 className="step-title">Your email address</h2>
                    <p className="step-subtitle">We'll send you updates about new admission opportunities</p>
                  </div>
                  <div className="form-group">
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="Enter your email address"
                      className={`form-input ${errors.email ? "input-error" : ""}`}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>
                </div>
              )}

              {/* Controls */}
              {!submitted ? (
                <div className={`button-group ${step === 0 ? 'single-button' : 'multiple-buttons'}`}>
                  {step > 0 && (
                    <button onClick={back} className="button button-secondary">
                      <ChevronLeft className="icon-left" /> Back
                    </button>
                  )}
                  {step < stepLabels.length - 1 ? (
                    <button onClick={next} className="button button-primary">
                      Next <ChevronRight className="icon-right" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting}
                      className="button button-primary button-wide"
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Complete Registration <Check className="icon-right" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="submitted-message">
                  <div className="success-header">
                    <Check className="success-icon" />
                    <p>You're in! Your details have been captured.</p>
                  </div>
                  <div className="button-group">
                    <button
                      onClick={handleBeginChat}
                      className="button button-primary button-wide"
                    >
                      Begin Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sign in link */}
          <div className="signin-link-container">
            <p>
              Already have an account?{" "}
              <a href="/signin" className="signin-link">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UniVisionSignupLanding;

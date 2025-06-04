import axios from "axios";
import React, { useState } from "react";

export default function SignupForm({ setshowLogin }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setPasswordWarning("");
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    
    // ✅ Fix: Strict check for password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordWarning("Passwords do not match");
      return;
    }

    setLoading(true);
    const url = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

    try {
      const res = await axios.post(`${url}/api/v1/signup`, formData);

      // ✅ Fix: Properly clear the form data
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);
      setshowLogin(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Signup failed. Please try again.");
      console.error("Error while signing up:", err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm text-[var(--text-color)] px-6 py-8 rounded-lg shadow-lg border border-[var(--accent-color)] border-opacity-30 fade-in max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-[var(--accent-color)]">Create Account</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label htmlFor="name" className="font-medium mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Full Name
          </label>
          <input
            required
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="name"
            name="name"
            value={formData.name}
            type="text"
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="font-medium mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Address
          </label>
          <input
            required
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="email"
            name="email"
            value={formData.email}
            type="email"
            onChange={handleChange}
            placeholder="Enter your email address"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="password" className="font-medium mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Password
          </label>
          <input
            required
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="password"
            name="password"
            value={formData.password}
            type="password"
            onChange={handleChange}
            placeholder="Create a strong password"
          />
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="confirmPassword" className="font-medium mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Confirm Password
          </label>
          <input
            required
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            type="password"
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </div>
        
        {(passwordWarning || errorMessage) && (
          <div className="text-sm font-medium text-red-500 bg-red-100 bg-opacity-50 p-2 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {passwordWarning || errorMessage}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="bg-[var(--accent-color)] hover:bg-opacity-80 text-white font-bold w-full mx-auto px-4 py-3 rounded-md transition-all duration-300 mt-2 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Sign Up
            </>
          )}
        </button>
      </form>
      
      <div className="w-full border-t border-[var(--accent-color)] border-opacity-30 my-4"></div>
      <div className="w-full flex justify-center gap-2">
        <p>Already have an account?</p>
        <span 
          onClick={() => setshowLogin(true)} 
          className="font-medium cursor-pointer text-[var(--accent-color)] hover:underline transition-all duration-200"
        >
          Log in
        </span>
      </div>
    </div>
  );
}

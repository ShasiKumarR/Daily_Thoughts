import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLoggedIn } from "../store/loginSlice";

export default function LoginForm({ setshowLogin }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setErrorMessage("");
    const nameToChange = event.target.name;
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [nameToChange]: value }));
  };
  axios.defaults.withCredentials = true;
  const handleLogin = async (event) => {
    event.preventDefault();
    if (formData.password == "" || formData.email === "") {
      setErrorMessage("Please fill all the details.");
      return;
    }
    setLoading(true);
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const res = await axios.post(`${url}/api/v1/login`, formData, {
        withCredentials: true,
      });
      console.log(res.data.token)
      // sessionStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.data.token);
      setLoading(false);
      dispatch(changeLoggedIn(true));
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.response.data.message);
      console.log("Error while login");
      setLoading(false);
    }
  };
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm text-[var(--text-color)] px-6 py-8 rounded-lg shadow-lg border border-[var(--accent-color)] border-opacity-30 fade-in max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-[var(--accent-color)]">Welcome Back</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="font-medium mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Address
          </label>
          <input
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter your email"
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
            className="px-4 py-2 rounded-md bg-white bg-opacity-30 border-[var(--accent-color)] border-opacity-30 border w-full outline-none focus:border-opacity-100 transition-all duration-300"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password"
          />
        </div>
        {errorMessage != "" && (
          <div className="text-sm font-medium text-red-500 bg-red-100 bg-opacity-50 p-2 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {errorMessage}
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
              Logging In...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </>
          )}
        </button>
      </form>
      <div className="w-full flex justify-end mt-2">
        <Link to="/forgetpassword" className="text-sm text-[var(--accent-color)] hover:underline transition-all duration-200">
          Forgot password?
        </Link>
      </div>
      <div className="w-full border-t border-[var(--accent-color)] border-opacity-30 my-4"></div>
      <div className="w-full flex justify-center gap-2">
        <p>Don't have an account?</p>
        <span
          onClick={() => setshowLogin(false)}
          className="font-medium cursor-pointer text-[var(--accent-color)] hover:underline transition-all duration-200"
        >
          Sign up
        </span>
      </div>
    </div>
  );
}

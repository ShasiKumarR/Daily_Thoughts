import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLoggedIn } from "../store/loginSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.delete(`${url}/logout`, {
        withCredentials: true,
      });
      sessionStorage.removeItem("token");
      dispatch(changeLoggedIn(false));
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.log(err);
      setIsLoggingOut(false);
      navigate("/");
    }
  };

  return (
    <div className="w-full font-semibold text-black h-fit mx-auto flex items-center shadow-md bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
      <div className="w-full py-3 h-fit px-4 mx-auto md:text-[18px] text-[16px] flex items-center justify-between max-w-[1080px]">
        <Link to="/dashboard" className="nav-link group flex items-center">
          <h1 className="font-bold text-[18px] md:text-[22px] text-[var(--accent-color)]">Daily Thoughts</h1>
        </Link>
        <div className="flex gap-4 md:gap-6">
          <Link to="/createnew" className="nav-link">
            <button className="font-semibold px-3 py-1 rounded-md hover:bg-[var(--accent-color)] hover:text-white transition-colors duration-300">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Thought
              </span>
            </button>
          </Link>
          <div onClick={handleLogout} className="nav-link">
            <button className="font-semibold px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300">
              {isLoggingOut ? (
                "Logging out..."
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

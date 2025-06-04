import React, { useState } from "react";
import NavBar from "../components/NavBar";
import MoodSelector from "../components/MoodSelector";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";

export default function CreateNew() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const token = localStorage.getItem("token");
    // const token = sessionStorage.getItem("token");
    if(token === null||token===undefined){
      dispatch(changeLoggedIn(false));
      // navigate("/")
      return;
    }
  //const token = sessionStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  
  const [formData, setFormData] = useState({ 
    date: "", 
    body: "",
    mood: "content",
    moodIntensity: 3
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleMoodChange = (mood) => {
    setFormData((prevData) => ({
      ...prevData,
      mood
    }));
  };
  
  const handleMoodIntensityChange = (intensity) => {
    setFormData((prevData) => ({
      ...prevData,
      moodIntensity: intensity
    }));
  };
  const createDiary = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.post(`${url}/api/v1/creatediary`, formData, {
        withCredentials: true,
      });
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.log("error while creating diary");
      console.log(err);
      setLoading(false);
      setErrorMessage(err.response.data.message);
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="h-full w-full overflow-hidden  flex flex-col items-center gap-3">
      <NavBar />
      <form
        onSubmit={createDiary}
        className="w-full max-w-[1080px] h-full flex flex-col gap-2 px-2"
      >
        <div className="flex flex-col">
          <div className="flex gap-2">
            <label className="font-semibold" htmlFor="date">Select Date</label>
            <input
              required
              className="w-[120px] bg-transparent border border-black outline-none rounded-md"
              type="date"
              id="date"
              name="date"
              value={formData.date}
              max={today}
              onChange={handleChange}
            />
          </div>
          {errorMessage !== "" && (
            <div className="text-xs text-red-400">{errorMessage}</div>
          )}
        </div>
        {/* Mood Selector */}
        <div className="mb-4 bg-white bg-opacity-20 p-4 rounded-lg">
          <MoodSelector
            selectedMood={formData.mood}
            onMoodChange={handleMoodChange}
            intensity={formData.moodIntensity}
            onIntensityChange={handleMoodIntensityChange}
          />
        </div>
        
        <div className="h-[70%] ">
          <label className="font-semibold " htmlFor="content">
            Write Content
          </label>
          <textarea
            required
            className="h-[96%] hideScrollbar outline-none w-full bg-black bg-opacity-10 border border-green-800 rounded-md p-2 text-slate-300"
            id="content"
            name="body"
            value={formData.body}
            rows={8}
            onChange={handleChange}
            placeholder="Write your thoughts here..."
          />
        </div>
        <button
          type="submit"
          className="w-fit px-3 hover:bg-opacity-70 transition-all duration-200 py-1 rounded-md mx-auto bg-black text-white bg-opacity-50"
        >
          {loading ? "saving" : "save"}
        </button>
      </form>
    </div>
  );
}

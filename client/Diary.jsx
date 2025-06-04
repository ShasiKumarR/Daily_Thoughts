import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import MoodSelector from "../components/MoodSelector";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";

export default function Diary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      dispatch(changeLoggedIn(false));
      navigate("/");
    }
  }, [token]);

  const [deleteButton, setDeleteButton] = useState("Delete");
  const { diaryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [diary, setDiary] = useState(null);
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedDiary, setUpdatedDiary] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", "error", ""
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [selectedMood, setSelectedMood] = useState('content');
  const [moodIntensity, setMoodIntensity] = useState(3);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteButton("Deleting...");
    try {
      // Updated to match the new backend route
      const response = await axios.delete(`${baseUrl}/api/v1/deletediary/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      console.log('Delete response:', response.data);
      
      setDeleteButton("Delete");
      setShowDeleteConfirm(false);
      navigate("/dashboard"); // Only navigate after successful deletion
    } catch (err) {
      console.error("Error while deleting", err);
      setDeleteButton("Delete");
      setShowDeleteConfirm(false);
      
      // Show error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to delete diary. Please try again.");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };
  
  const handleEdit = async () => {
    if (!edit) {
      setEdit(true);
      setUpdatedDiary(diary?.body);
      setSelectedMood(diary?.mood || 'content');
      setMoodIntensity(diary?.moodIntensity || 3);
      updateCounts(diary?.body || "");
      return;
    }
  
    try {
      setSaveStatus("saving");
      
      // Using the updated API endpoint with the diaryId as a path parameter
      const res = await axios.put(
        `${baseUrl}/api/v1/updatediary/${diaryId}`,  
        { 
          body: updatedDiary,
          mood: selectedMood,
          moodIntensity: moodIntensity
        }, // Send the updated content and mood data
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      console.log('Update response:', res.data);
      
      // Update the diary state with the response data
      if (res.data && res.data.success) {
        setDiary(res.data); 
        setEdit(false);
        setSaveStatus("saved");
        
        // Reset save status after 3 seconds
        setTimeout(() => {
          setSaveStatus("");
        }, 3000);
      } else {
        throw new Error("Update was not successful");
      }
    } catch (err) {
      console.error("Error while updating diary", err);
      setSaveStatus("error");
      
      // Show error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to save diary. Please try again.");
      }
      
      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus("");
        setErrorMessage("");
      }, 3000);
    }
  };
  
  const updateCounts = (text) => {
    if (!text) {
      setWordCount(0);
      setCharCount(0);
      return;
    }
    
    const trimmedText = text.trim();
    const words = trimmedText ? trimmedText.split(/\s+/).filter(word => word.length > 0) : [];
    
    setCharCount(text.length);
    setWordCount(words.length);
  };
  
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setUpdatedDiary(newText);
    updateCounts(newText);
  };
  
  const getDiary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/v1/getdiary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { diaryId },
        withCredentials: true,
      });
      setDiary(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage("No diary found");
    }
  };

  useEffect(() => {
    getDiary();
  }, []);
  
  // Auto-save feature
  useEffect(() => {
    let autoSaveTimer;
    
    if (edit && updatedDiary !== diary?.body) {
      autoSaveTimer = setTimeout(() => {
        if (edit && updatedDiary !== diary?.body) {
          handleEdit();
        }
      }, 60000); // Auto-save after 1 minute of inactivity
    }
    
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [updatedDiary, edit]);

  return (
    <div className="w-full h-full">
      <NavBar />
      <div className="content-container max-w-[1080px] mx-auto px-4 py-6 mt-4 fade-in">
        {loading ? (
          <div className="w-full flex justify-center items-center py-10">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-[var(--accent-color)]">Loading your diary...</p>
            </div>
          </div>
        ) : diary ? (
          <div className="diary-container">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent-color)] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {edit ? "Edit Diary" : "Your Diary"}
                </h1>
                <p className="text-sm text-gray-600 mt-1 ml-9">{diary.date}</p>
              </div>
              
              <div className="flex gap-2">
                {!edit ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDeleteRequest}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>{deleteButton}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {saveStatus === "saving" ? "Saving..." : 
                         saveStatus === "saved" ? "Saved!" : 
                         saveStatus === "error" ? "Error!" : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setEdit(false);
                        setUpdatedDiary("");
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </button>
                  </>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </Link>
              </div>
            </div>
            
            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            
            {/* Delete confirmation dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                  <p className="mb-6">Are you sure you want to delete this diary entry? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={handleDeleteCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteConfirm}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Current mood display (when not editing) */}
            {!edit && diary.mood && (
              <div className="mb-4 p-4 bg-white bg-opacity-20 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mood
                </h3>
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: diary.mood === 'happy' ? '#FFD700' :
                                      diary.mood === 'excited' ? '#FF8C00' :
                                      diary.mood === 'grateful' ? '#9370DB' :
                                      diary.mood === 'relaxed' ? '#87CEFA' :
                                      diary.mood === 'content' ? '#98FB98' :
                                      diary.mood === 'tired' ? '#A9A9A9' :
                                      diary.mood === 'anxious' ? '#FFA07A' :
                                      diary.mood === 'sad' ? '#6495ED' :
                                      diary.mood === 'angry' ? '#FF6347' :
                                      diary.mood === 'stressed' ? '#FF4500' : '#98FB98',
                      opacity: 0.5 + (diary.moodIntensity * 0.1)
                    }}
                  >
                    <span className="text-sm font-bold">{diary.mood.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-medium capitalize">{diary.mood}</div>
                    <div className="text-xs text-gray-600">
                      Intensity: {diary.moodIntensity}/5
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="diary-content bg-white bg-opacity-10 rounded-lg p-6 shadow-md">
              {edit ? (
                <div className="edit-mode">
                  {/* Mood Selector */}
                  <div className="mb-6">
                    <MoodSelector 
                      selectedMood={selectedMood} 
                      onMoodChange={setSelectedMood}
                      intensity={moodIntensity}
                      onIntensityChange={setMoodIntensity}
                    />
                  </div>
                  
                  <textarea
                    value={updatedDiary}
                    onChange={handleTextChange}
                    className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent"
                  />
                  <div className="text-right text-sm text-gray-500 mt-2">
                    {wordCount} words | {charCount} characters
                  </div>
                </div>
              ) : (
                <div className="view-mode whitespace-pre-wrap">{diary.body}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No diary found with this ID.</p>
            <Link
              to="/dashboard"
              className="inline-block mt-4 px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-200"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

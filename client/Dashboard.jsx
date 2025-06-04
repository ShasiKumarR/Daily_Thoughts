import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
import ShowDiary from "../components/ShowDiary";
import MoodSummary from "../components/MoodSummary";
import { useDispatch } from "react-redux";
import { changeLoggedIn } from "../store/loginSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  
  // Redirect if no token
  if(token === null || token === undefined) {
    dispatch(changeLoggedIn(false));
    return;
  }
  
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" or "oldest"
  const [refreshKey, setRefreshKey] = useState(0); // For forcing refresh
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const url = import.meta.env.VITE_BASE_URL;
      const res = await axios.get(`${url}/api/v1/getuser`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setLoading(false);
    } catch (err) {
      console.log(err);
      console.log(err.response?.data?.message);
      setLoading(false);
      navigate("/");
    }
  };
  
  useEffect(() => {
    getUserDetails();
  }, [refreshKey]);
  
  // Filter and sort diaries
  const getFilteredAndSortedDiaries = () => {
    if (!user?.diary || user.diary.length === 0) return [];
    
    let filteredDiaries = user.diary;
    
    // Apply search filter if search term exists
    if (searchTerm.trim() !== "") {
      filteredDiaries = filteredDiaries.filter(diary => 
        diary.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort diaries by date
    return filteredDiaries.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  };
  
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "newest" ? "oldest" : "newest");
  };

  const filteredDiaries = getFilteredAndSortedDiaries();
  
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
              <p className="mt-2 text-[var(--accent-color)]">Loading your thoughts...</p>
            </div>
          </div>
        ) : user && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-bold text-2xl text-[var(--accent-color)] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Welcome, {user.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1 ml-9">Your personal diary collection</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Analytics and Preferences Links */}
                <div className="flex gap-2 mb-3 sm:mb-0">
                  <Link 
                    to="/analytics"
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="hidden md:inline">Analytics</span>
                  </Link>
                  <Link 
                    to="/preferences"
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden md:inline">Preferences</span>
                  </Link>
                </div>
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by date..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-[var(--accent-color)] outline-none w-full sm:w-auto"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Sort Button */}
                <button 
                  onClick={toggleSortOrder}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </button>
                
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  title="Refresh"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                
              </div>
            </div>

            {/* Mood Summary */}
            <MoodSummary diaries={filteredDiaries} />
            
            {/* Create New Diary Button */}
            <Link
              to="/createnew"
              className="fixed bottom-6 right-6 bg-[var(--accent-color)] text-white p-4 rounded-full shadow-lg hover:bg-[var(--accent-hover)] transition-colors duration-200 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            
            {filteredDiaries.length > 0 ? (
              <>
                {searchTerm && (
                  <p className="mb-4 text-sm text-gray-600">
                    Found {filteredDiaries.length} {filteredDiaries.length === 1 ? 'entry' : 'entries'} matching "{searchTerm}"
                  </p>
                )}
                
                <div className="w-full flex-wrap flex gap-x-4 sm:gap-x-6 gap-y-6 justify-center md:justify-start py-4">
                  {filteredDiaries.map((d) => (
                    <ShowDiary key={d._id || d.diaryId} diary={d} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10 bg-white bg-opacity-20 rounded-lg">
                {searchTerm ? (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg">No entries found matching "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-[var(--accent-color)] hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg mb-3">You haven't written any diary entries yet</p>
                    <Link 
                      to="/createnew" 
                      className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Write Your First Entry
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

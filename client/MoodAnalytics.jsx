import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MOOD_COLORS = {
  'happy': '#FFD700',
  'excited': '#FF8C00',
  'grateful': '#9370DB',
  'relaxed': '#87CEFA',
  'content': '#98FB98',
  'tired': '#A9A9A9',
  'anxious': '#FFA07A',
  'sad': '#6495ED',
  'angry': '#FF6347',
  'stressed': '#FF4500'
};

const MOOD_DESCRIPTIONS = {
  'happy': 'You tend to feel joyful and content.',
  'excited': 'You experience enthusiasm and anticipation.',
  'grateful': 'You appreciate the positive aspects of life.',
  'relaxed': 'You feel calm and at ease.',
  'content': 'You experience satisfaction with your current state.',
  'tired': 'You feel physically or mentally exhausted.',
  'anxious': 'You experience worry or unease.',
  'sad': 'You feel sorrow or unhappiness.',
  'angry': 'You experience strong feelings of displeasure.',
  'stressed': 'You feel mental or emotional tension.'
};

const MoodAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMoodAnalytics = async () => {
      try {
        setLoading(true);
        const url = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${url}/api/v1/mood-analytics`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        
        if (response.data.success) {
          setAnalytics(response.data.analytics);
        } else {
          throw new Error(response.data.message || 'Failed to fetch mood analytics');
        }
      } catch (err) {
        console.error('Error fetching mood analytics:', err);
        setError(err.message || 'An error occurred while fetching mood analytics');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMoodAnalytics();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <svg className="animate-spin h-10 w-10 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-[var(--accent-color)]">Loading your mood analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!analytics || analytics.totalEntries === 0) {
    return (
      <div className="text-center p-6 bg-white bg-opacity-20 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">No Mood Data Yet</h3>
        <p className="text-gray-600">Start tracking your mood with diary entries to see analytics here.</p>
      </div>
    );
  }

  // Calculate percentages for mood distribution
  const moodPercentages = {};
  Object.entries(analytics.moodDistribution).forEach(([mood, count]) => {
    moodPercentages[mood] = Math.round((count / analytics.totalEntries) * 100);
  });

  return (
    <div className="mood-analytics bg-white bg-opacity-20 rounded-lg p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--accent-color)] mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Your Mood Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Streak Card */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold">Current Streak</h3>
            </div>
            <div className="text-3xl font-bold text-center my-3">{analytics.streakDays} days</div>
            <p className="text-sm text-gray-600 text-center">Keep writing daily to maintain your streak!</p>
          </div>
          
          {/* Most Common Mood Card */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="font-semibold">Most Common Mood</h3>
            </div>
            <div className="flex items-center justify-center my-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: MOOD_COLORS[analytics.mostCommonMood] || '#ccc' }}
              >
                <span className="text-xl">{analytics.mostCommonMood.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xl font-semibold capitalize">{analytics.mostCommonMood}</span>
            </div>
            <p className="text-sm text-gray-600 text-center">{MOOD_DESCRIPTIONS[analytics.mostCommonMood]}</p>
          </div>
        </div>
      </div>
      
      {/* Mood Distribution */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Mood Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(moodPercentages)
            .filter(([_, percentage]) => percentage > 0)
            .sort(([_, a], [__, b]) => b - a)
            .map(([mood, percentage]) => (
              <div key={mood} className="bg-white bg-opacity-30 p-2 rounded-lg">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                    style={{ backgroundColor: MOOD_COLORS[mood] || '#ccc' }}
                  >
                    <span className="text-sm font-bold">{mood.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-xs font-medium capitalize">{mood}</span>
                  <span className="text-lg font-bold">{percentage}%</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      
      {/* Recent Mood Trend */}
      {analytics.moodTrend && analytics.moodTrend.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Recent Mood Trend
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="flex space-x-2">
                {analytics.moodTrend.map((entry, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: MOOD_COLORS[entry.mood] || '#ccc',
                        opacity: 0.5 + (entry.intensity * 0.1) // Adjust opacity based on intensity
                      }}
                    >
                      <span className="text-sm font-bold">{entry.mood.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-xs mt-1">{entry.date.split('-').slice(1).join('/')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-6 text-right">
        Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default MoodAnalytics;

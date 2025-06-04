import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserPreferences = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    reminderEnabled: false,
    reminderTime: '20:00',
    privacyDefault: false,
    moodTrackingEnabled: true,
    moodTrackingReminders: false,
    defaultMood: 'content',
    showMoodSummary: true,
    weatherTrackingEnabled: false,
    locationTrackingEnabled: false,
    favoriteQuotes: [],
    favoriteTags: []
  });
  const [newTag, setNewTag] = useState('');
  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setLoading(true);
        const url = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${url}/api/v1/getuser`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        
        if (response.data.success && response.data.user.preferences) {
          setPreferences(response.data.user.preferences);
        }
      } catch (err) {
        console.error('Error fetching user preferences:', err);
        toast.error('Failed to load your preferences');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserPreferences();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !preferences.favoriteTags.includes(newTag.trim())) {
      setPreferences(prev => ({
        ...prev,
        favoriteTags: [...prev.favoriteTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTags: prev.favoriteTags.filter(t => t !== tag)
    }));
  };

  const handleAddQuote = () => {
    if (newQuote.trim() && !preferences.favoriteQuotes.includes(newQuote.trim())) {
      setPreferences(prev => ({
        ...prev,
        favoriteQuotes: [...prev.favoriteQuotes, newQuote.trim()]
      }));
      setNewQuote('');
    }
  };

  const handleRemoveQuote = (quote) => {
    setPreferences(prev => ({
      ...prev,
      favoriteQuotes: prev.favoriteQuotes.filter(q => q !== quote)
    }));
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const url = import.meta.env.VITE_BASE_URL;
      const response = await axios.put(
        `${url}/api/v1/preferences`,
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        toast.success('Preferences saved successfully');
      } else {
        throw new Error(response.data.message || 'Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error(err.message || 'Failed to save your preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-screen">
        <svg className="animate-spin h-10 w-10 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-3 text-[var(--accent-color)]">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent-color)]">Your Preferences</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sm font-medium text-[var(--accent-color)] hover:text-[var(--accent-hover)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Section */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Appearance
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                name="theme"
                value={preferences.theme}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reminders
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="reminderEnabled"
                name="reminderEnabled"
                checked={preferences.reminderEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
              />
              <label htmlFor="reminderEnabled" className="ml-2 block text-sm text-gray-700">
                Enable daily reminders
              </label>
            </div>
            {preferences.reminderEnabled && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Time</label>
                <input
                  type="time"
                  name="reminderTime"
                  value={preferences.reminderTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                />
              </div>
            )}
          </div>

          {/* Privacy Section */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="privacyDefault"
                name="privacyDefault"
                checked={preferences.privacyDefault}
                onChange={handleChange}
                className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
              />
              <label htmlFor="privacyDefault" className="ml-2 block text-sm text-gray-700">
                Make new entries private by default
              </label>
            </div>
          </div>

          {/* Tracking Features */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tracking Features
            </h2>
            <div className="space-y-3">
              {/* Mood Tracking Section */}
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="moodTrackingEnabled"
                    name="moodTrackingEnabled"
                    checked={preferences.moodTrackingEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                  />
                  <label htmlFor="moodTrackingEnabled" className="ml-2 block text-sm font-medium text-gray-700">
                    Enable mood tracking
                  </label>
                </div>
                
                {preferences.moodTrackingEnabled && (
                  <div className="ml-6 space-y-2 mt-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="moodTrackingReminders"
                        name="moodTrackingReminders"
                        checked={preferences.moodTrackingReminders}
                        onChange={handleChange}
                        className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                      />
                      <label htmlFor="moodTrackingReminders" className="ml-2 block text-sm text-gray-700">
                        Remind me to track my mood
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showMoodSummary"
                        name="showMoodSummary"
                        checked={preferences.showMoodSummary}
                        onChange={handleChange}
                        className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                      />
                      <label htmlFor="showMoodSummary" className="ml-2 block text-sm text-gray-700">
                        Show mood summary on dashboard
                      </label>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Mood</label>
                      <select
                        name="defaultMood"
                        value={preferences.defaultMood}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm"
                      >
                        <option value="happy">Happy</option>
                        <option value="excited">Excited</option>
                        <option value="grateful">Grateful</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="content">Content</option>
                        <option value="tired">Tired</option>
                        <option value="anxious">Anxious</option>
                        <option value="sad">Sad</option>
                        <option value="angry">Angry</option>
                        <option value="stressed">Stressed</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Other Tracking Options */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="weatherTrackingEnabled"
                  name="weatherTrackingEnabled"
                  checked={preferences.weatherTrackingEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                />
                <label htmlFor="weatherTrackingEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable weather tracking
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="locationTrackingEnabled"
                  name="locationTrackingEnabled"
                  checked={preferences.locationTrackingEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] border-gray-300 rounded"
                />
                <label htmlFor="locationTrackingEnabled" className="ml-2 block text-sm text-gray-700">
                  Enable location tracking
                </label>
              </div>
            </div>
          </div>

          {/* Favorite Tags */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Favorite Tags
            </h2>
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a favorite tag"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-r-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.favoriteTags.map((tag, index) => (
                <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                  <span className="mr-1">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Quotes */}
          <div className="bg-white bg-opacity-30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--accent-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Favorite Quotes
            </h2>
            <div className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Add a favorite quote"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddQuote()}
                />
                <button
                  type="button"
                  onClick={handleAddQuote}
                  className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-r-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {preferences.favoriteQuotes.map((quote, index) => (
                <div key={index} className="flex items-start bg-gray-100 rounded p-2 text-sm">
                  <span className="flex-grow">{quote}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuote(quote)}
                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={savePreferences}
            disabled={saving}
            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded-md hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodAnalytics from '../components/MoodAnalytics';

const Analytics = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mood');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent-color)]">Your Analytics</h1>
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

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'mood'
              ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('mood')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mood Insights
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'writing'
              ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('writing')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Writing Stats
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'tags'
              ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('tags')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tag Analysis
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white bg-opacity-10 rounded-lg p-4 shadow-sm">
        {activeTab === 'mood' && (
          <MoodAnalytics />
        )}
        
        {activeTab === 'writing' && (
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Writing Stats Coming Soon</h3>
            <p className="text-gray-600">We're working on analyzing your writing patterns and habits.</p>
          </div>
        )}
        
        {activeTab === 'tags' && (
          <div className="text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Tag Analysis Coming Soon</h3>
            <p className="text-gray-600">We're building tools to help you analyze your most used tags and topics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

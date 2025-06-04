import React from 'react';
import { Link } from 'react-router-dom';

const MoodSummary = ({ diaries }) => {
  // Skip if no diaries or diaries without mood
  if (!diaries || diaries.length === 0) {
    return null;
  }

  // Count diaries with mood data
  const diariesWithMood = diaries.filter(diary => diary.mood);
  if (diariesWithMood.length === 0) {
    return null;
  }

  // Calculate mood distribution
  const moodCounts = {};
  diariesWithMood.forEach(diary => {
    moodCounts[diary.mood] = (moodCounts[diary.mood] || 0) + 1;
  });

  // Find most common mood
  let mostCommonMood = null;
  let highestCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > highestCount) {
      mostCommonMood = mood;
      highestCount = count;
    }
  });

  // Get mood color
  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return '#FFD700';
      case 'excited': return '#FF8C00';
      case 'grateful': return '#9370DB';
      case 'relaxed': return '#87CEFA';
      case 'content': return '#98FB98';
      case 'tired': return '#A9A9A9';
      case 'anxious': return '#FFA07A';
      case 'sad': return '#6495ED';
      case 'angry': return '#FF6347';
      case 'stressed': return '#FF4500';
      default: return '#98FB98';
    }
  };

  // Get mood description
  const getMoodDescription = (mood) => {
    switch (mood) {
      case 'happy': return 'You tend to feel joyful and content.';
      case 'excited': return 'You experience enthusiasm and anticipation.';
      case 'grateful': return 'You appreciate the positive aspects of life.';
      case 'relaxed': return 'You feel calm and at ease.';
      case 'content': return 'You experience satisfaction with your current state.';
      case 'tired': return 'You feel physically or mentally exhausted.';
      case 'anxious': return 'You experience worry or unease.';
      case 'sad': return 'You feel sorrow or unhappiness.';
      case 'angry': return 'You experience strong feelings of displeasure.';
      case 'stressed': return 'You feel mental or emotional tension.';
      default: return 'Your mood varies.';
    }
  };

  // Calculate percentage for most common mood
  const percentage = Math.round((highestCount / diariesWithMood.length) * 100);

  return (
    <div className="mood-summary bg-white bg-opacity-20 rounded-lg p-4 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-[var(--accent-color)] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mood Insights
        </h3>
        <Link 
          to="/analytics" 
          className="text-sm text-[var(--accent-color)] hover:underline flex items-center"
        >
          <span>View Full Analytics</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: getMoodColor(mostCommonMood), opacity: 0.7 }}
        >
          <span className="text-lg font-bold">{mostCommonMood.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm mb-1">
            Your most common mood is <span className="font-semibold capitalize">{mostCommonMood}</span> 
            <span className="text-xs ml-1">({percentage}% of entries)</span>
          </div>
          <p className="text-xs text-gray-600">{getMoodDescription(mostCommonMood)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{diariesWithMood.length} entries with mood data</span>
          <span>{Object.keys(moodCounts).length} different moods tracked</span>
        </div>
      </div>
    </div>
  );
};

export default MoodSummary;

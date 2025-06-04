import React from 'react';

const MOODS = [
  { value: 'happy', label: 'Happy', icon: '😊', color: '#FFD700' },
  { value: 'excited', label: 'Excited', icon: '😃', color: '#FF8C00' },
  { value: 'grateful', label: 'Grateful', icon: '🙏', color: '#9370DB' },
  { value: 'relaxed', label: 'Relaxed', icon: '😌', color: '#87CEFA' },
  { value: 'content', label: 'Content', icon: '😊', color: '#98FB98' },
  { value: 'tired', label: 'Tired', icon: '😴', color: '#A9A9A9' },
  { value: 'anxious', label: 'Anxious', icon: '😰', color: '#FFA07A' },
  { value: 'sad', label: 'Sad', icon: '😢', color: '#6495ED' },
  { value: 'angry', label: 'Angry', icon: '😠', color: '#FF6347' },
  { value: 'stressed', label: 'Stressed', icon: '😫', color: '#FF4500' }
];

const MoodSelector = ({ selectedMood, onMoodChange, intensity, onIntensityChange }) => {
  // Replace emoji icons with SVG icons
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'excited':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      case 'grateful':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'relaxed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'content':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'tired':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'anxious':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'sad':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'angry':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'stressed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="mood-selector">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((mood) => (
            <div
              key={mood.value}
              onClick={() => onMoodChange(mood.value)}
              className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                selectedMood === mood.value
                  ? 'bg-opacity-50 ring-2 ring-offset-2 ring-[var(--accent-color)]'
                  : 'bg-opacity-20 hover:bg-opacity-30'
              }`}
              style={{ backgroundColor: mood.color }}
            >
              <div className="text-2xl mb-1" style={{ color: selectedMood === mood.value ? 'var(--accent-color)' : 'currentColor' }}>
                {getMoodIcon(mood.value)}
              </div>
              <span className="text-xs font-medium">{mood.label}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedMood && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How intense is this feeling? ({intensity})
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => onIntensityChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Strong</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;

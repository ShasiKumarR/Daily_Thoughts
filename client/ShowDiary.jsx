import React, { useState } from 'react'
import diarylogo from "../assets/dailythought.png"
import { Link } from 'react-router-dom'

export default function ShowDiary({diary}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the date for better display
  const formatDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[parseInt(month) - 1]}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Link 
      to={`/diary/${diary.diaryId}`} 
      className='diary-card sm:w-44 w-40 relative overflow-hidden rounded-lg shadow-md shadow-black fade-in'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-full">
        <img 
          className={`w-full transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          src={diarylogo} 
          alt="Diary entry" 
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-50'}`}></div>
        
        {/* Mood indicator */}
        {diary.mood && (
          <div className='absolute top-2 right-2'>
            <div 
              className='w-8 h-8 rounded-full flex items-center justify-center'
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
                opacity: 0.8
              }}
            >
              <span className='text-sm font-bold'>{diary.mood.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}
        
        {/* Date display */}
        <div className='absolute bottom-0 left-0 right-0 p-3 text-center'>
          <div className='flex flex-col items-center'>
            <div className='text-white font-bold text-lg'>
              {formatDate(diary.date)}
            </div>
            <div className='text-white text-xs opacity-80'>
              <div className="flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {diary.date}
              </div>
              {diary.mood && (
                <div className="flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="capitalize">{diary.mood}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hover effect with view icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

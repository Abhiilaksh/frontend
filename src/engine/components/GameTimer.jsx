import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const GameTimer = ({ 
  isActive, 
  onTimeUp, 
  initialTime, 
  increment = 0, // Time increment in seconds
  playerColor,
  currentTurn,
  onMove
}) => {
  const [timeRemaining, setTimeRemaining] = useState({
    white: initialTime,
    black: initialTime
  });
  
  const lastTurnRef = useRef(currentTurn);
  const timerRef = useRef(null);
  
  // Determine active color based on current turn
  const activeColor = currentTurn === 'w' ? 'white' : 'black';
  
  // Check if a move was just made (turn changed)
  useEffect(() => {
    if (lastTurnRef.current !== currentTurn && increment > 0) {
      // Previous active player just completed their move, add increment
      const previousActiveColor = currentTurn === 'w' ? 'black' : 'white';
      
      setTimeRemaining(prev => ({
        ...prev,
        [previousActiveColor]: prev[previousActiveColor] + increment
      }));
    }
    
    // Update the reference
    lastTurnRef.current = currentTurn;
  }, [currentTurn, increment]);
  
  useEffect(() => {
    // If game is active, run the timer for the current player
    if (isActive) {
      // Clear any existing interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          // Only decrease time for the active player
          const newTime = {
            ...prev,
            [activeColor]: Math.max(0, prev[activeColor] - 1)
          };
          
          // Check if time is up
          if (newTime[activeColor] === 0) {
            clearInterval(timerRef.current);
            onTimeUp(activeColor);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      // Clear interval when game is paused
      clearInterval(timerRef.current);
    }
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, activeColor, onTimeUp]);
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playerIsWhite = playerColor === 'w';
  const yourColor = playerIsWhite ? 'white' : 'black';
  const botColor = playerIsWhite ? 'black' : 'white';

  return (
    <div className="flex justify-between w-[20rem] text-gray-900 mx-2 gap-6">
      <div 
        className={`text-center flex-1 px-4 py-2 rounded-lg ${
          activeColor === 'white' && isActive 
            ? 'bg-blue-100 border-2 border-blue-500' 
            : 'bg-gray-100'
        }`}
      >
        <div className="font-semibold">{playerIsWhite ? 'You (White)' : 'Bot (White)'}</div>
        <div className={`text-2xl font-mono ${timeRemaining.white < 30 ? 'text-red-600' : ''}`}>
          {formatTime(timeRemaining.white)}
        </div>
        {increment > 0 && <div className="text-xs text-gray-600">+{increment}s/move</div>}
      </div>
      
      <div 
        className={`text-center flex-1 px-4 py-2 rounded-lg ${
          activeColor === 'black' && isActive 
            ? 'bg-blue-100 border-2 border-blue-500' 
            : 'bg-gray-100'
        }`}
      >
        <div className="font-semibold">{!playerIsWhite ? 'You (Black)' : 'Bot (Black)'}</div>
        <div className={`text-2xl font-mono ${timeRemaining.black < 30 ? 'text-red-600' : ''}`}>
          {formatTime(timeRemaining.black)}
        </div>
        {increment > 0 && <div className="text-xs text-gray-600">+{increment}s/move</div>}
      </div>
    </div>
  );
};

export default GameTimer;
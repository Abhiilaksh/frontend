import React, { useState } from 'react';
import { toast } from 'react-toastify';

const HintPanel = ({ game, difficulty, isPlayerTurn, onHintReceived, hints }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHintType, setSelectedHintType] = useState('bestMove');
  const [showHintOptions, setShowHintOptions] = useState(false);
  const [usedHints, setUsedHints] = useState(0);
  const [hintsLimit, setHintsLimit] = useState(hints);
  console.log("hints count" + hints)

  const hintOptions = [
    { id: 'strategic', name: 'Strategic Advice', description: 'General position evaluation and strategy' },
    { id: 'piece', name: 'Which Piece to Move', description: 'Shows which piece to consider without destination' },
    { id: 'tactical', name: 'Tactical Opportunity', description: 'Highlights tactical opportunities or threats' },
    { id: 'bestMove', name: 'Best Move', description: 'Reveals the best move in the position' },
  ];

  const requestHint = async () => {
    if (!game || !isPlayerTurn) {
      toast.info('Hint not available right now', { position: 'top-center', autoClose: 2000 });
      return;
    }

    if (usedHints >= hintsLimit) {
      toast.warning(`You've reached the limit of ${hintsLimit} hints per game`, { 
        position: 'bottom-right', 
        autoClose: 3000 
      });
      return;
    }

    try {
      setIsLoading(true);
      const fen = game.fen();
      
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_ENGINE_API_URL}hint?fen=${encodeURIComponent(fen)}&type=${selectedHintType}&depth=${difficulty}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get hint from server');
      }

      const hintData = await response.json();
      
      // Increment used hints counter
      setUsedHints(prev => prev + 1);
      
      // Pass hint data to parent component
      onHintReceived(hintData);
      
      // Show toast based on hint type
      displayHintToast(hintData);
      
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to get hint', { position: 'bottom-right', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const displayHintToast = (hintData) => {
    const { hintType } = hintData;
    
    switch (hintType) {
      case 'strategic':
        toast.info(hintData.advice, {
          position: 'bottom-right',
          autoClose: 5000
        });
        break;
        
      case 'pieceSelection':
        toast.info(`Consider moving the piece at ${hintData.fromSquare}`, {
          position: 'bottom-right',
          autoClose: 3000
        });
        break;
        
      case 'tactical':
        toast.info(hintData.message, {
          position: 'bottom-right',
          autoClose: 4000
        });
        break;
        
      case 'bestMove':
        toast.success(`Best move: ${hintData.from} to ${hintData.to}`, {
          position: 'bottom-right',
          autoClose: 3000
        });
        break;
        
      default:
        toast.info('Hint received', {
          position: 'bottom-right',
          autoClose: 2000
        });
    }
  };

  const resetHints = () => {
    setUsedHints(0);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Game Hints</h3>
        <div className="text-sm text-gray-600">
          {usedHints}/{hintsLimit} hints used
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowHintOptions(!showHintOptions)}
          className="w-full text-left px-3 py-2 bg-blue-50 rounded flex justify-between items-center"
        >
          <div className="font-medium">
            {hintOptions.find(option => option.id === selectedHintType)?.name || 'Select hint type'}
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${showHintOptions ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {showHintOptions && (
          <div className="mt-2 bg-white border border-gray-200 rounded shadow-sm">
            {hintOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedHintType(option.id);
                  setShowHintOptions(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                  selectedHintType === option.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={requestHint}
        disabled={isLoading || usedHints >= hintsLimit || !isPlayerTurn}
        className={`w-full py-2 rounded font-medium ${
          isLoading || usedHints >= hintsLimit || !isPlayerTurn
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } transition-colors`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Getting Hint...
          </span>
        ) : usedHints >= hintsLimit ? (
          'No Hints Remaining'
        ) : !isPlayerTurn ? (
          'Hint Available on Your Turn'
        ) : (
          'Get Hint'
        )}
      </button>

      <div className="mt-3 text-xs text-gray-500">
        <p className="mb-1">Hints provide guidance but may not show the absolute best move in all positions.</p>
        <p>Using more hints will reveal more specific information.</p>
      </div>
    </div>
  );
};

export default HintPanel;
import React from 'react';

const ActiveHint = ({ hintData }) => {
  if (!hintData) return null;

  const renderHintContent = () => {
    switch (hintData.hintType) {
      case 'strategic':
        return (
          <div>
            <div className="mb-2">
              <span className="font-medium">Position evaluation:</span> {hintData.evaluation}
              {hintData.score && (
                <span className="text-sm ml-2">
                  ({hintData.score > 0 ? '+' : ''}{hintData.score.toFixed(2)})
                </span>
              )}
            </div>
            <p className="text-gray-700">{hintData.advice}</p>
          </div>
        );
        
      case 'pieceSelection':
        return (
          <div>
            <p className="text-gray-700">Consider moving the piece at <span className="font-bold">{hintData.fromSquare}</span></p>
            <p className="text-sm text-gray-500 mt-1">The square is highlighted on the board</p>
          </div>
        );
        
      case 'tactical':
        return (
          <div>
            <p className="text-gray-700">{hintData.message}</p>
            {hintData.from && hintData.to && (
              <p className="text-sm mt-1">
                Consider moving from <span className="font-bold">{hintData.from}</span> to <span className="font-bold">{hintData.to}</span>
              </p>
            )}
          </div>
        );
        
      case 'bestMove':
        return (
          <div>
            <p className="text-gray-700">
              Best move: <span className="font-bold">{hintData.from}</span> to <span className="font-bold">{hintData.to}</span>
              {hintData.promotion && <span> (promote to {hintData.promotion})</span>}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Evaluation: {hintData.score > 0 ? '+' : ''}{hintData.score.toFixed(2)}
            </p>
          </div>
        );
        
      default:
        return <p>Hint information unavailable</p>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">
          {hintData.hintType === 'strategic' && 'Strategic Advice'}
          {hintData.hintType === 'pieceSelection' && 'Piece Suggestion'}
          {hintData.hintType === 'tactical' && 'Tactical Opportunity'}
          {hintData.hintType === 'bestMove' && 'Best Move'}
        </h3>
      </div>
      
      <div className="border-t pt-3">
        {renderHintContent()}
      </div>
    </div>
  );
};

export default ActiveHint;
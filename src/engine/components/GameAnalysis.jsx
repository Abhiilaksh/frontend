import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { toast } from 'react-toastify';
import CustomChessboard from './ChessBoard';

const GameAnalysis = ({ moveHistory, game, difficulty, playerColor }) => {
    const [analysisInProgress, setAnalysisInProgress] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [tacticalOpportunities, setTacticalOpportunities] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(0);
    const [displayFen, setDisplayFen] = useState('');
    const [analysisType, setAnalysisType] = useState('overview'); // 'overview', 'position', 'tactics'

    // Extract FENs and moves from the move history
    const extractGameData = () => {
        if (!moveHistory || moveHistory.length === 0) {
            toast.error('No moves to analyze!');
            return null;
        }

        const fens = moveHistory.map(move => move.fen);

        // Extract the actual moves (not the initial position)
        const moves = [];
        for (let i = 1; i < moveHistory.length; i++) {
            const moveText = moveHistory[i].moveText;
            // Extract the move coordinates (e.g., "e2-e4" from "You: e2-e4")
            const moveParts = moveText.split(': ');
            if (moveParts.length > 1) {
                const coords = moveParts[1].split('-');
                if (coords.length === 2) {
                    moves.push({
                        from: coords[0],
                        to: coords[1]
                    });
                }
            }
        }

        return { fens, moves: moves.map(m => `${m.from}${m.to}`) };
    };

    const startAnalysis = async () => {
        const gameData = extractGameData();
        if (!gameData) return;

        setAnalysisInProgress(true);
        setAnalysisType('overview');
        try {
            // Analyze each position in the game
            const positions = [];
            for (let i = 0; i < gameData.fens.length; i++) {
                const fen = gameData.fens[i];
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_ENGINE_API_URL}analyze?fen=${encodeURIComponent(fen)}&depth=${difficulty}`);
                if (!response.ok) {
                    throw new Error('Failed to analyze position');
                }
                const analysis = await response.json();
                positions.push({
                    ...analysis,
                    moveNumber: i,
                    moveText: i === 0 ? "Starting position" : moveHistory[i].moveText
                });
            }

            setAnalysisResults({
                positions,
                overallEvaluation: calculateOverallEvaluation(positions)
            });

            setDisplayFen(gameData.fens[gameData.fens.length - 1]);
            setSelectedPosition(gameData.fens.length - 1);

            toast.success('Analysis completed!');
        } catch (error) {
            console.error('Analysis failed:', error);
            toast.error(`Analysis failed: ${error.message}`);
        } finally {
            setAnalysisInProgress(false);
        }
    };

    const startTacticalAnalysis = async () => {
        const gameData = extractGameData();
        if (!gameData) return;

        setAnalysisInProgress(true);
        setAnalysisType('tactics');
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_ENGINE_API_URL}find-tactics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fens: gameData.fens,
                    moves: gameData.moves,
                    depth: difficulty
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze tactical opportunities');
            }

            const tacticsData = await response.json();
            setTacticalOpportunities(tacticsData.opportunities || []);

            if (tacticsData.opportunities && tacticsData.opportunities.length > 0) {
                // Show the first tactical opportunity
                const firstOpportunity = tacticsData.opportunities[0];
                setDisplayFen(firstOpportunity.fen);
                toast.success(`Found ${tacticsData.opportunities.length} tactical opportunities!`);
            } else {
                setDisplayFen(gameData.fens[gameData.fens.length - 1]);
                toast.info('No significant tactical opportunities found.');
            }
        } catch (error) {
            console.error('Tactical analysis failed:', error);
            toast.error(`Tactical analysis failed: ${error.message}`);
        } finally {
            setAnalysisInProgress(false);
        }
    };

    const analyzeCurrentPosition = async () => {
        if (!game) {
            toast.error('No active game!');
            return;
        }

        setAnalysisInProgress(true);
        setAnalysisType('position');
        try {
            const fen = game.fen();
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_ENGINE_API_URL}analyze?fen=${encodeURIComponent(fen)}&depth=${difficulty}`);

            if (!response.ok) {
                throw new Error('Failed to analyze position');
            }

            const analysis = await response.json();
            setAnalysisResults({
                positions: [{
                    ...analysis,
                    moveNumber: moveHistory.length - 1,
                    moveText: "Current position"
                }],
                overallEvaluation: null
            });

            setDisplayFen(fen);
            toast.success('Position analyzed!');
        } catch (error) {
            console.error('Position analysis failed:', error);
            toast.error(`Position analysis failed: ${error.message}`);
        } finally {
            setAnalysisInProgress(false);
        }
    };

    const calculateOverallEvaluation = (positions) => {
        if (!positions || positions.length === 0) return null;

        // Skip the initial position
        const scores = positions
            .filter(p => p.moveNumber > 0)
            .map(p => p.score || 0);

        if (scores.length === 0) return null;

        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        const min = Math.min(...scores);
        const max = Math.max(...scores);

        let advantage;
        if (avg > 0.5) {
            advantage = "White has an advantage";
        } else if (avg < -0.5) {
            advantage = "Black has an advantage";
        } else {
            advantage = "Position is approximately equal";
        }

        return {
            averageScore: avg.toFixed(2),
            minScore: min.toFixed(2),
            maxScore: max.toFixed(2),
            advantage
        };
    };

    const handlePositionSelect = (index) => {
        if (analysisResults && analysisResults.positions && index < analysisResults.positions.length) {
            setSelectedPosition(index);
            setDisplayFen(analysisResults.positions[index].fen);
        }
    };

    const handleTacticsSelect = (opportunity) => {
        setDisplayFen(opportunity.fen);
    };

    const getArrows = () => {
        const arrows = [];
    
        if (analysisType === 'position' || analysisType === 'overview') {
            if (analysisResults && analysisResults.positions && analysisResults.positions.length > selectedPosition) {
                const position = analysisResults.positions[selectedPosition];
                if (position.bestMove && position.bestMove !== 'no move') {
                    const from = position.bestMove.substring(0, 2);
                    const to = position.bestMove.substring(2, 4);
                    
                    // Make sure from and to are valid squares (a1-h8)
                    if (/^[a-h][1-8]$/.test(from) && /^[a-h][1-8]$/.test(to)) {
                        arrows.push([from, to, 'green']);
                    }
                }
            }
        } else if (analysisType === 'tactics') {
            // For tactical analysis, show both the actual move and best move
            const opportunity = tacticalOpportunities.find(o => o.fen === displayFen);
            if (opportunity) {
                // Show actual move in red
                if (opportunity.actualMove) {
                    const from = opportunity.actualMove.substring(0, 2);
                    const to = opportunity.actualMove.substring(2, 4);
                    // Make sure from and to are valid squares
                    if (/^[a-h][1-8]$/.test(from) && /^[a-h][1-8]$/.test(to)) {
                        arrows.push([from, to, 'red']);
                    }
                }
    
                // Show best move in green
                if (opportunity.bestMove) {
                    const from = opportunity.bestMove.substring(0, 2);
                    const to = opportunity.bestMove.substring(2, 4);
                    // Make sure from and to are valid squares
                    if (/^[a-h][1-8]$/.test(from) && /^[a-h][1-8]$/.test(to)) {
                        arrows.push([from, to, 'green']);
                    }
                }
            }
        }
    
        return arrows;
    };

    const renderAnalysisResults = () => {
        if (analysisInProgress) {
            return (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg">Analyzing...</span>
                </div>
            );
        }

        if (!analysisResults) return null;

        if (analysisType === 'overview') {
            return (
                <div className="mt-4">
                    <h3 className="text-xlfont-bold mb-3">Game Analysis</h3>

                    {analysisResults.overallEvaluation && (
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                            <div className="text-lg font-semibold">Overall Evaluation</div>
                            <div className="flex flex-col mt-2">
                                <div>Average Score: {analysisResults.overallEvaluation.averageScore}</div>
                                <div>Range: [{analysisResults.overallEvaluation.minScore}, {analysisResults.overallEvaluation.maxScore}]</div>
                                <div className="mt-1 font-medium">{analysisResults.overallEvaluation.advantage}</div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <h4 className="text-lg font-semibold mb-2">Position Timeline</h4>
                        <div className="h-64 overflow-y-auto border border-gray-200 rounded">
                            {analysisResults.positions.map((position, index) => (
                                <div
                                    key={index}
                                    className={`p-2 cursor-pointer hover:bg-blue-50 border-b border-gray-200 ${selectedPosition === index ? 'bg-blue-100' : ''
                                        }`}
                                    onClick={() => handlePositionSelect(index)}
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-medium mr-2">{position.moveNumber}.</span>
                                            <span>{position.moveText}</span>
                                        </div>
                                        <div className={`font-medium ${position.score > 0.5 ? 'text-green-600' :
                                                position.score < -0.5 ? 'text-red-600' :
                                                    'text-gray-600'
                                            }`}>
                                            {position.score ? position.score.toFixed(2) : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {analysisResults.positions && analysisResults.positions[selectedPosition] && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Selected Position Analysis</h4>
                            <div className="p-3 bg-gray-100 rounded">
                                <div>
                                    <span className="font-medium">Position Score:</span>
                                    <span className={`ml-2 ${analysisResults.positions[selectedPosition].score > 0.5 ? 'text-green-600 font-medium' :
                                            analysisResults.positions[selectedPosition].score < -0.5 ? 'text-red-600 font-medium' :
                                                'text-gray-600'
                                        }`}>
                                        {analysisResults.positions[selectedPosition].score ?
                                            analysisResults.positions[selectedPosition].score.toFixed(2) : 'N/A'}
                                    </span>
                                </div>

                                <div className="mt-2">
                                    <span className="font-medium">Best Move:</span>
                                    <span className="ml-2 text-green-600 font-medium">
                                        {analysisResults.positions[selectedPosition].bestMove !== 'no move' ?
                                            analysisResults.positions[selectedPosition].bestMove : 'N/A'}
                                    </span>
                                </div>

                                {analysisResults.positions[selectedPosition].lines &&
                                    analysisResults.positions[selectedPosition].lines.length > 0 && (
                                        <div className="mt-2">
                                            <div className="font-medium">Top Variations:</div>
                                            <div className="mt-1 text-sm">
                                                {analysisResults.positions[selectedPosition].lines
                                                    .filter(line => line.pv)
                                                    .slice(0, 3)
                                                    .map((line, idx) => (
                                                        <div key={idx} className="mb-1">
                                                            {line.pv.slice(0, 5).join(' ')}
                                                            {line.score && ` (${line.score.toFixed(2)})`}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            );
        } else if (analysisType === 'position') {
            return (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-3">Current Position Analysis</h3>

                    {analysisResults.positions && analysisResults.positions[0] && (
                        <div className="p-3 bg-gray-100 rounded">
                            <div>
                                <span className="font-medium">Position Score:</span>
                                <span className={`ml-2 ${analysisResults.positions[0].score > 0.5 ? 'text-green-600 font-medium' :
                                        analysisResults.positions[0].score < -0.5 ? 'text-red-600 font-medium' :
                                            'text-gray-600'
                                    }`}>
                                    {analysisResults.positions[0].score ? analysisResults.positions[0].score.toFixed(2) : 'N/A'}
                                </span>
                            </div>

                            <div className="mt-2">
                                <span className="font-medium">Best Move:</span>
                                <span className="ml-2 text-green-600 font-medium">
                                    {analysisResults.positions[0].bestMove !== 'no move' ?
                                        analysisResults.positions[0].bestMove : 'N/A'}
                                </span>
                            </div>

                            {analysisResults.positions[0].lines && analysisResults.positions[0].lines.length > 0 && (
                                <div className="mt-4">
                                    <div className="font-medium">Top Variations:</div>
                                    <div className="mt-2">
                                        {analysisResults.positions[0].lines
                                            .filter(line => line.pv)
                                            .slice(0, 3)
                                            .map((line, idx) => (
                                                <div key={idx} className="mb-2 p-2 bg-gray-50 rounded">
                                                    <div className="font-medium text-blue-700">Variation {idx + 1}:</div>
                                                    <div className="mt-1">
                                                        {line.pv && line.pv.slice(0, 8).join(' ')}
                                                        {line.score !== undefined &&
                                                            <span className={`ml-2 font-medium ${line.score > 0 ? 'text-green-600' :
                                                                    line.score < 0 ? 'text-red-600' :
                                                                        'text-gray-600'
                                                                }`}>
                                                                ({typeof line.score === 'number' ? line.score.toFixed(2) : line.score})
                                                            </span>
                                                        }
                                                        {line.mate !== undefined &&
                                                            <span className="ml-2 font-bold text-purple-600">
                                                                (Mate in {Math.abs(line.mate)})
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    const renderTacticalOpportunities = () => {
        if (analysisInProgress) {
            return (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg">Analyzing tactics...</span>
                </div>
            );
        }

        if (!tacticalOpportunities || tacticalOpportunities.length === 0) {
            return (
                <div className="mt-4 p-3 bg-gray-100 rounded text-center">
                    No significant tactical opportunities found in this game.
                </div>
            );
        }

        return (
            <div className="mt-4">
                <h3 className="text-xl font-bold mb-3">Tactical Opportunities</h3>
                <div className="h-64 overflow-y-auto border border-gray-200 rounded">
                    {tacticalOpportunities.map((opportunity, index) => (
                        <div
                            key={index}
                            className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-200 ${displayFen === opportunity.fen ? 'bg-blue-100' : ''
                                }`}
                            onClick={() => handleTacticsSelect(opportunity)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">Move {opportunity.moveNumber}: </span>
                                    <span className={`font-medium ${opportunity.classification === 'Blunder' ? 'text-red-600' :
                                            opportunity.classification === 'Mistake' ? 'text-orange-600' :
                                                opportunity.classification === 'Inaccuracy' ? 'text-yellow-600' :
                                                    'text-gray-600'
                                        }`}>
                                        {opportunity.classification}
                                    </span>
                                </div>
                                <div className="text-red-600 font-medium">
                                    {opportunity.scoreDifference > 0 ? '+' : ''}
                                    {opportunity.scoreDifference.toFixed(2)}
                                </div>
                            </div>
                            <div className="mt-1 text-sm">
                                <span>Played: </span>
                                <span className="font-mono">{opportunity.actualMove}</span>
                                <span className="mx-2">|</span>
                                <span>Best: </span>
                                <span className="font-mono text-green-600">{opportunity.bestMove}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {displayFen && (
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <div className="font-medium mb-2">Position Details:</div>
                        {tacticalOpportunities.find(o => o.fen === displayFen) && (
                            <div>
                                <div>
                                    <span className="font-medium">Played Move: </span>
                                    <span className="font-mono">{tacticalOpportunities.find(o => o.fen === displayFen).actualMove}</span>
                                </div>
                                <div className="mt-1">
                                    <span className="font-medium">Best Move: </span>
                                    <span className="font-mono text-green-600">{tacticalOpportunities.find(o => o.fen === displayFen).bestMove}</span>
                                </div>
                                <div className="mt-1">
                                    <span className="font-medium">Evaluation Difference: </span>
                                    <span className="text-red-600 font-medium">
                                        {tacticalOpportunities.find(o => o.fen === displayFen).scoreDifference.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="mt-2 text-sm text-gray-600">
                            Green arrow shows the best move. Red arrow shows the played move.
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full text-gray-900">
            <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                    <div className="flex mb-4 justify-center gap-2">
                        <button
                            onClick={analyzeCurrentPosition}
                            disabled={analysisInProgress}
                            className={`px-4 py-2 rounded transition-colors ${analysisInProgress ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            Analyze Current Position
                        </button>
                        <button
                            onClick={startAnalysis}
                            disabled={analysisInProgress || !moveHistory || moveHistory.length <= 1}
                            className={`px-4 py-2 rounded transition-colors ${analysisInProgress || !moveHistory || moveHistory.length <= 1
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                        >
                            Analyze Full Game
                        </button>
                        <button
                            onClick={startTacticalAnalysis}
                            disabled={analysisInProgress || !moveHistory || moveHistory.length <= 2}
                            className={`px-4 py-2 rounded transition-colors ${analysisInProgress || !moveHistory || moveHistory.length <= 2
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                                }`}
                        >
                            Find Tactical Opportunities
                        </button>
                    </div>

                    <div>
                        {displayFen && (
                            <div>
                                <CustomChessboard
                                    fen={displayFen}
                                    boardOrientation={playerColor === 'w' ? 'white' : 'black'}
                                    arePiecesDraggable={false}
                                    arrows={getArrows()}
                                    customSquareStyles={{}}
                                    width={96}
                                />
                                <div className="mt-2 text-xs text-gray-500">
                                    Arrows: {JSON.stringify(getArrows())}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 order-1 md:order-2">
                    {analysisType === 'tactics' ? renderTacticalOpportunities() : renderAnalysisResults()}
                </div>
            </div>
        </div>
    );
};

export default GameAnalysis;
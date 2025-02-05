import { useState } from 'react';
import axios from 'axios';
import './style.css';

/* eslint-disable react/prop-types */

const Analysis = ({ list }) => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [bestMove, setBestMove] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFullAnalysis, setShowFullAnalysis] = useState(false);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8080/stockfish/api/chess/analyze', list, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setAnalysisResult(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setLoading(false);
        }
    };

    const fetchBestMove = async () => {
        try {
            setLoading(true);
            const lastFen = list[list.length - 1];
            if (!lastFen) {
                throw new Error("FEN is undefined.");
            }
            console.log(`FEN: ${lastFen}`);

            const res = await axios.post("http://localhost:8080/stockfish/api/chess/best-move", {
                fen: lastFen
            });
            console.log("Best move response:", res);
            setBestMove(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching best move: ", error);
            setLoading(false);
        }
    };

    const handleFetch = (type) => {
        setShowResult(true);
        setAnalysisResult(null); // Clear previous result
        setBestMove(null); // Clear previous best move
        if (type === 'hints') {
            fetchBestMove();
        } else {
            setShowFullAnalysis(type === 'full');
            fetchAnalysis();
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <button onClick={() => handleFetch('current')} style={{ marginBottom: '10px', padding: '10px' }}>
                Current Analysis
            </button>
            {/* <button onClick={() => handleFetch('full')} style={{ marginBottom: '10px', padding: '10px' }}>
                Full Game Analysis
            </button> */}
            <button onClick={() => handleFetch('hints')} style={{ marginBottom: '10px', padding: '10px' }}>
                Hints
            </button>

            {loading && <p>Loading...</p>}

            {showResult && !loading && analysisResult && (
                <div
                    style={{ padding: '10px', border: '1px solid #ddd', marginTop: '10px' }}
                    className='h-96 overflow-y-auto no-scrollbar'
                >
                    {showFullAnalysis ? (
                        analysisResult.map((result, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <h3>FEN: </h3>
                                <span>{result.fen}</span>
                                <p><strong>White Win Probability:</strong> {result.whiteWinProbability}</p>
                                <p><strong>Black Win Probability:</strong> {result.blackWinProbability}</p>
                                <p><strong>Draw Probability:</strong> {result.drawProbability}</p>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h3>FEN: {analysisResult[analysisResult.length - 1].fen}</h3>
                            <p><strong>White Win Probability:</strong> {analysisResult[analysisResult.length - 1].whiteWinProbability}</p>
                            <p><strong>Black Win Probability:</strong> {analysisResult[analysisResult.length - 1].blackWinProbability}</p>
                            <p><strong>Draw Probability:</strong> {analysisResult[analysisResult.length - 1].drawProbability}</p>
                        </div>
                    )}
                </div>
            )}

            {showResult && !loading && bestMove && (
                <div style={{ padding: '10px', border: '1px solid #ddd', marginTop: '10px' }}>
                    <h3>Best Move: {bestMove}</h3>
                </div>
            )}
        </div>
    );
};

export default Analysis;
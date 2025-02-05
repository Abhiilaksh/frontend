/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Analysis from "./Analysis";
import MoveHistory from "./MoveHistory";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { formatTime } from "./utils";
import './style.css';


const customPieces = {
    wP: ({ squareWidth }) => <img src="/assets/pieces/wp.png" alt="White Pawn" style={{ width: squareWidth, height: squareWidth }} />,
    wR: ({ squareWidth }) => <img src="/assets/pieces/wr.png" alt="White Rook" style={{ width: squareWidth, height: squareWidth }} />,
    wN: ({ squareWidth }) => <img src="/assets/pieces/wn.png" alt="White Knight" style={{ width: squareWidth, height: squareWidth }} />,
    wB: ({ squareWidth }) => <img src="/assets/pieces/wb.png" alt="White Bishop" style={{ width: squareWidth, height: squareWidth }} />,
    wQ: ({ squareWidth }) => <img src="/assets/pieces/wq.png" alt="White Queen" style={{ width: squareWidth, height: squareWidth }} />,
    wK: ({ squareWidth }) => <img src="/assets/pieces/wk.png" alt="White King" style={{ width: squareWidth, height: squareWidth }} />,
    bP: ({ squareWidth }) => <img src="/assets/pieces/bp.png" alt="Black Pawn" style={{ width: squareWidth, height: squareWidth }} />,
    bR: ({ squareWidth }) => <img src="/assets/pieces/br.png" alt="Black Rook" style={{ width: squareWidth, height: squareWidth }} />,
    bN: ({ squareWidth }) => <img src="/assets/pieces/bn.png" alt="Black Knight" style={{ width: squareWidth, height: squareWidth }} />,
    bB: ({ squareWidth }) => <img src="/assets/pieces/bb.png" alt="Black Bishop" style={{ width: squareWidth, height: squareWidth }} />,
    bQ: ({ squareWidth }) => <img src="/assets/pieces/bq.png" alt="Black Queen" style={{ width: squareWidth, height: squareWidth }} />,
    bK: ({ squareWidth }) => <img src="/assets/pieces/bk.png" alt="Black King" style={{ width: squareWidth, height: squareWidth }} />,
  };


const GamePage = (props) => {

    const { playerData } = props;

    const [game, setGame] = useState(new Chess());
    const [isBotTurn, setIsBotTurn] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [playerColor, setPlayerColor] = useState("white");
    const [difficulty, setDifficulty] = useState(10);
    const [moveHistory, setMoveHistory] = useState([]);
    const [highlightedSquares, setHighlightedSquares] = useState({}); 
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [showValidMoves, setShowValidMoves] = useState(false);
    const [fenList, setFenList] = useState([]);

    const [playerTime, setPlayerTime] = useState(parseInt(playerData?.time || "0") * 60);
    const [botTime, setBotTime] = useState(parseInt(playerData?.time || "0") * 60);

    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); 
    const [isReviewMode, setIsReviewMode] = useState(false);

    useEffect(() => {

        if(playerData?.playWithTime && gameInProgress){
            const timerInterval = setInterval(() => {
                if (isBotTurn) {
                    setBotTime(prevTime => {
                        if (prevTime === 1) {
                            
                            toast.success("Bot's time is up! You win!");
                            quitGame();
                        }
                        
                        return Math.max(prevTime - 1, 0); 
                    });
                } else {
                    setPlayerTime(prevTime => {
                        if (prevTime === 1) {
                            
                            toast.error("Your time is up! Bot wins!");
                            quitGame();
                        }

                        return Math.max(prevTime - 1, 0); 
                    });
                }
            }, 1000);

            console.log(playerTime, botTime);

            return () => clearInterval(timerInterval);
        }
    }, [gameInProgress, isBotTurn, playerData?.playWithTime]);

    useEffect(() => {
        // If the move is completed, apply the increment to the time
        if (playerData?.playWithTime && playerData?.increment != 0) {
            if (isBotTurn) {
                setBotTime(prevTime => prevTime + parseInt(playerData?.increment || "0"));
            } else {
                setPlayerTime(prevTime => prevTime + parseInt(playerData?.increment || "0"));
            }
        }
    }, [isBotTurn]); 

    useEffect(() => {

        // setMoveHistory([]);
        console.log("FEN List:", fenList);
    }, [fenList]);

    useEffect(() => {
        setPlayerColor(playerData?.player || "white");
    }, [playerData]);

    useEffect(() => {
        
        setFenList((prev) => {
            console.log(moveHistory);
            const uniqueFenList = [...new Set([...prev, game.fen()])];
            return uniqueFenList;
        });
    }, [game, game.fen()]);
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave? Your game progress will be lost.";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    

    useEffect(() => {
        if (isBotTurn) {
            console.log("Bot's turn");
            console.log(`Bot made move \n: ${game.fen()}\n`);
        } else {
            console.log("Your turn");
            console.log(`You made move \n: ${game.fen()}\n`);
        }
    }, [isBotTurn, game]);


    const onDrop = async (sourceSquare, targetSquare) => {

        if (!gameInProgress) {
            toast.error("The game has not started yet. Please start the game first.");
            return;  
        }

        if (isReviewMode) {
            const confirmChange = window.confirm(
                "Making a move here will truncate the subsequent move history. Do you want to continue?"
            );
            if (!confirmChange) return;
    
            const truncatedHistory = moveHistory.slice(0, currentMoveIndex + 1);
            setMoveHistory(truncatedHistory);
            setCurrentMoveIndex(truncatedHistory.length - 1);
            setIsReviewMode(false); 
        }

        const isPawnPromotion =
        (game.turn() === "w" && sourceSquare[1] === "7" && targetSquare[1] === "8") ||
        (game.turn() === "b" && sourceSquare[1] === "2" && targetSquare[1] === "1");

        let move;
        if (isPawnPromotion) {
            
            const promotionPiece = prompt(
                "Pawn promotion! Enter the piece to promote to (q, r, b, n):",
                "q"
            );

            if (!["q", "r", "b", "n"].includes(promotionPiece)) {
                toast.error("Invalid promotion piece! Must be one of: q, r, b, n.");
                return;
            }

            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: promotionPiece, 
            });
            
        } else {
            move = game.move({ from: sourceSquare, to: targetSquare });
        }


        if (move) {
            setGame(game);
            setMoveHistory((prev) => {
                const newMoveHistory = [...prev, { move: move.san, fen: game.fen() }];
                localStorage.setItem("moveHistory", JSON.stringify(newMoveHistory));
                setCurrentMoveIndex(newMoveHistory.length - 1);
                return newMoveHistory;
            });

            setHighlightedSquares({
                [sourceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
                [targetSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
            });

            if (game.isGameOver()) {
                handleGameOver("player");
                return;
            }

            setIsBotTurn(true);

            await makeBotMove();
        }
        else {
            toast.error("Invalid move !");
        }

    };

    const onPieceClick = (square) => {
        if (!gameInProgress) return;
    
        const piece = game.get(square);

        if (piece && piece.color === (playerColor === "white" ? "w" : "b")) {
          
          setSelectedPiece(square);

          const moves = game.moves({ square: square, verbose: true });
          const newHighlightedSquares = {};

          moves.forEach((move) => {
            newHighlightedSquares[move.to] = { backgroundColor: "rgba(255, 255, 0, 0.5)" }
          });
          
          if(showValidMoves){
            setHighlightedSquares(newHighlightedSquares);
          } 
          else {
            setHighlightedSquares({ [square]: { backgroundColor: "rgba(255, 255, 0, 0.5)" } });
          }

        } else if (selectedPiece) {
          
          const move = game.move({
            from: selectedPiece,
            to: square,
            promotion: "q", 
          })
    
          if (move) {
            setGame(new Chess(game.fen()))
            setMoveHistory((prev) => [...prev, { move: move.san, fen: game.fen() }])
            
            setSelectedPiece(null)
            setHighlightedSquares({})
    
            if (game.isGameOver()) {
              handleGameOver("player")
              return
            }
    
            setIsBotTurn(true)
            makeBotMove()
          } else {
            
            setSelectedPiece(null)
            setHighlightedSquares({})
          }
        }
      }


    const makeBotMove = async () => {
        const fen = game.fen();  

        try {
            const response = await axios.post("http://localhost:8080/stockfish/api/chess/best-move", {
                fen: fen
            });

            const botMove = response.data; 
            const sourceSquare = botMove.slice(0, 2);
            const targetSquare = botMove.slice(2, 4);


            game.move(botMove);
            setGame(game);

            setMoveHistory((prev) => {
                const newMoveHistory = [...prev, { move: botMove, fen: game.fen() }];
                localStorage.setItem("moveHistory", JSON.stringify(newMoveHistory));
                setCurrentMoveIndex(newMoveHistory.length - 1);
                return newMoveHistory;
            });

            setHighlightedSquares({
                [sourceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
                [targetSquare]: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
            });

            if (game.isGameOver()) {
                handleGameOver("bot");
                return;
            }

            setIsBotTurn(false);
        } catch (error) {
            console.error("Error fetching the best move from Stockfish:", error);
        }

    };

    const startGame = async () => {

        if (gameInProgress) {
            toast.error("Please end the current game before starting a new one.");
            return; 
        }

        try {

            await axios.post("http://localhost:8080/stockfish/api/chess/start"); 
            setGame(new Chess()); 
            setCurrentMoveIndex(-1);
            setMoveHistory([]);
            setFenList([]);
            setHighlightedSquares({});

            const botStarts = playerColor === "black";

            setIsBotTurn(botStarts);  
            setGameInProgress(true); 

            if(playerData?.playWithTime){
                setPlayerTime(parseInt(playerData?.time || "0") * 60);
                setBotTime(parseInt(playerData?.time || "0") * 60);
            }

            toast.success("New game started!");

            if (botStarts) {
                makeBotMove();
            }

        } catch (error) {
            console.error("Error starting the game:", error);
        }
    };

    const quitGame = async () => {

        if (!gameInProgress) {
            toast.error("No game is in progress.");
            return; 
        }

        try {
            await axios.post("http://localhost:8080/stockfish/api/chess/quit");  
            setGame(new Chess());  
            setIsBotTurn(false); 
            setHighlightedSquares({}); 

            setGameInProgress(false);  
            toast.success("Game ended successfully!");

        } catch (error) {
            console.error("Error quitting the game:", error);
            toast.error("Error ending the game!");
        }
    };

    const handleGameOver = (lastMover) => {
        if (game.isCheckmate()) {
            if (lastMover === "player") {
                toast.success("Checkmate! You wins!");
            } else {
                toast.success("Checkmate! Bot win!");
            }
        } else if (game.isStalemate()) {
            toast.info("Stalemate! It's a draw!");
        } else if (game.isDraw()) {
            toast.info("Game ended in a draw!");
        }
    
        setGameInProgress(false);
        setIsBotTurn(false);
        toast.info("Game over! Please start a new game.");
    };

    const handleColorChange = (event) => {
        if (gameInProgress) {
            toast.error("You cannot change color during a game. Please end the current game first.");
            return;
        }
        setPlayerColor(event.target.value);
        toast.success(`Player color set to ${event.target.value}`);
    };

    const setStockfishDifficulty = async (level) => {
        console.log("function called");
        try {
            await axios.post(
            `http://localhost:8080/stockfish/api/chess/set-difficulty?level=${level}`
            );

            setDifficulty(level);
            toast.success(`Stockfish difficulty set to level: ${level}`);

        } catch (error) {

            console.error("Error setting difficulty:", error);
            toast.error("Failed to set difficulty. Please try again.");
        }
    };

    const copyFEN = () => {
        navigator.clipboard.writeText(game.fen())
            .then(() => {
                toast.success("FEN copied to clipboard!");
            })
            .catch((error) => {
                console.error("Failed to copy FEN:", error);
                toast.error("Failed to copy FEN.");
            });
    };

    useEffect(() => {
        console.log('Selected Piece:', selectedPiece);
        console.log('Highlighted Squares:', highlightedSquares);

    }, [selectedPiece, highlightedSquares]);
    
    useEffect(() => {
        console.log('Current Board FEN:', game.fen());

    }, [game]);

    const handleBack = () => {
        if (currentMoveIndex > 0) {
            const newIndex = currentMoveIndex - 1;
            setCurrentMoveIndex(newIndex);
            setGame(new Chess(moveHistory[newIndex].fen)); 
            setIsReviewMode(true);
        }
    };
    
    const handleForward = () => {
        if (currentMoveIndex < moveHistory.length - 1) {
            const newIndex = currentMoveIndex + 1;
            setCurrentMoveIndex(newIndex);
            setGame(new Chess(moveHistory[newIndex].fen)); 
            setIsReviewMode(newIndex === moveHistory.length - 1 ? false : true);
        }
    };
    


    return ( 
        <div className="flex justify-center items-center flex-col">

            {playerData?.playWithTime && (
                <div>
                    <h2>Player Time: {formatTime(playerTime)}</h2>
                    <h2>Bot Time: {formatTime(botTime)}</h2>
                </div>
            )}

            <div className="mb-4 flex gap-4">

                <button
                    onClick={startGame}
                    className="px-4 py-1 bg-green-500 text-white rounded"
                >
                    Start
                </button>
                <button
                    onClick={quitGame}
                    className="px-4 py-1 bg-red-500 text-white rounded"
                >
                    End
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-1 bg-yellow-500 text-white rounded"
                >
                    Reset
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={handleBack}
                        disabled={currentMoveIndex <= 0 || playerData?.playWithTime} // Disable if no previous move
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={currentMoveIndex === moveHistory.length - 1 || gameInProgress || playerData?.playWithTime} // Disable if no next move
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        Forward
                    </button>
                </div>

                <button
                    onClick={() => {
                        setCurrentMoveIndex(moveHistory.length - 1);
                        setGame(new Chess(moveHistory[moveHistory.length - 1].fen));
                        setIsReviewMode(false); // Exit review mode
                    }}
                    disabled={!isReviewMode && !gameInProgress || playerData?.playWithTime} // Disable if not in review mode
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                    Resume Game
                </button>
                
            </div>

            <div className="flex w-[100%] gap-10 mb-4">

                <div className="flex flex-col gap-4 text-sm flex-1">
                    <span>
                        Hello, {playerData?.name || "Player"}! You are playing as {playerData?.player || playerColor}.
                    </span>
                    <Analysis list={fenList} />
                </div>

                <div className="md:h-[35%] md:w-[35%] sm:h-[60%] sm:w-[60%] flex flex-1">
                    <Chessboard
                        id="defaultBoard"
                        position={game.fen()}
                        onPieceDrop={onDrop}
                        onSquareClick={onPieceClick}
                        boardOrientation={playerColor}
                        customSquareStyles={highlightedSquares}
                        customBoardStyle={{
                            borderRadius: "0.25rem",
                        }}
                        customDarkSquareStyle={{
                            backgroundColor: "#888c94"
                        }}
                        customLightSquareStyle={{
                            backgroundColor: "#f0ecec", 
                        }}
                        customPieces={customPieces}
                        arePiecesDraggable={!isReviewMode}
                    />
                </div>

                <div className="
                    mt-6 text-white h-[65vh] bg-gray-800 w-[30rem] flex-1 p-4 rounded-md text-sm relative
                ">

                    <MoveHistory moveHistory={moveHistory}/>

                    <div className="absolute bottom-4 left-2 right-2 flex flex-col justify-between">

                        <label>FEN : </label>

                        <div 
                        className="bg-gray-900 rounded-sm py-2 px-4 flex justify-between items-center"
                        >
                            
                            <span className="text-xs text-white">{game.fen()}</span>

                            <button
                                onClick={copyFEN}
                                className="px-2 py-1 text-white rounded"
                            >
                                <MdContentCopy />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div
                className="flex gap-4"
            >
                <div>
                    <label htmlFor="difficultySelect" className="mr-2 text-white">
                        Set Difficulty:
                    </label>

                    <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setStockfishDifficulty(Number(e.target.value))}
                        className="no-scrollbar px-4 py-2 border rounded-lg text-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        {Array.from({ length: 21 }, (_, i) => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="colorSelect" className="mr-2">Choose Your Color:</label>
                    <select
                        id="colorSelect"
                        value={playerColor}
                        onChange={handleColorChange}
                        className="px-2 py-1 border rounded text-black"
                    >
                        <option value="white">White</option>
                        <option value="black">Black</option>
                    </select>
                </div>
                <div className="mb-4">

                    <label htmlFor="showMoves" className="mr-2 text-white">Show valid moves:</label>

                    <select
                        id="showMoves"
                        value={showValidMoves ? "yes" : "no"}
                        onChange={(e) => setShowValidMoves(e.target.value === "yes")}
                        className="px-4 py-2 border rounded-lg text-sm bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

            </div>
        </div>
    );
}
 
export default GamePage;
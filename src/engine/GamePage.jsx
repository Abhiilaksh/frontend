import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { toast } from "react-hot-toast";

const GamePage = () => {

    const [game, setGame] = useState(new Chess());
    const [isBotTurn, setIsBotTurn] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);

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

        const move = game.move({ from: sourceSquare, to: targetSquare });

        if (move) {
            setGame(game);

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

    const makeBotMove = async () => {
        const fen = game.fen();  

        try {
            const response = await axios.post("http://localhost:8080/stockfish/api/chess/best-move", {
                fen: fen
            });

            const botMove = response.data; 
            game.move(botMove);
            setGame(game);

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

            setIsBotTurn(false);  
            setGameInProgress(true);  
            toast.success("New game started!");

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
        toast.info("Game over! Please start a new game.");
    };


    return ( 
        <div className="flex justify-center items-center flex-col">

            <div className="flex justify-between mb-4">
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
            </div>

            <div className="h-[70vh] w-[70vh]">
                <Chessboard
                    id="defaultBoard"
                    position={game.fen()}
                    onPieceDrop={onDrop}
                />
            </div>
        </div>
    );
}
 
export default GamePage;
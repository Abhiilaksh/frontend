import React, { useRef, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";

const customPieces = {
  wP: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wp.png"
      alt="White Pawn"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  wR: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wr.png"
      alt="White Rook"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  wN: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wn.png"
      alt="White Knight"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  wB: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wb.png"
      alt="White Bishop"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  wQ: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wq.png"
      alt="White Queen"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  wK: ({ squareWidth }) => (
    <img
      src="/assets/pieces/wk.png"
      alt="White King"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bP: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bp.png"
      alt="Black Pawn"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bR: ({ squareWidth }) => (
    <img
      src="/assets/pieces/br.png"
      alt="Black Rook"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bN: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bn.png"
      alt="Black Knight"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bB: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bb.png"
      alt="Black Bishop"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bQ: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bq.png"
      alt="Black Queen"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
  bK: ({ squareWidth }) => (
    <img
      src="/assets/pieces/bk.png"
      alt="Black King"
      style={{ width: squareWidth, height: squareWidth }}
    />
  ),
};

const CustomChessboard = ({
  fen,
  selectedSquare,
  onSquareClick,
  onPieceDrop,
  boardOrientation,
  customSquareStyles,
  width,
  arrows = [],
  arePiecesDraggable = true,
}) => {
  const chessboardRef = useRef(null);
  const [chessboardSize, setChessboardSize] = useState(600); // Default size

  // Get the chessboard size dynamically
  useEffect(() => {
    if (chessboardRef.current) {
      const { width } = chessboardRef.current.getBoundingClientRect();
      setChessboardSize(width);
    }
  }, [width]);

  // Function to convert chess square to pixel coordinates
  const getSquareCoordinates = (square, boardOrientation) => {
    const file = square.charCodeAt(0) - "a".charCodeAt(0); // File (0-7, a-h)
    let rank = parseInt(square[1], 10); // Rank (1-8)
  
    // Adjust rank for board orientation
    if (boardOrientation === "black") {
      rank = 9 - rank; // Flip the rank for black's perspective
    } else {
      rank = rank - 1; // Adjust for white's perspective
    }
  
    const squareSize = chessboardSize / 8; // Size of each square
    return {
      x: file * squareSize + squareSize / 2, // Center of the square
      y: rank * squareSize + squareSize / 2, // Center of the square
    };
  };

  return (
    <div
      ref={chessboardRef}
      className="w-full h-full"
      style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}
    >
      {/* Chessboard */}
      <Chessboard
        id="defaultBoard"
        position={fen}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customBoardStyle={{
          borderRadius: "0.25rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#888c94",
        }}
        customLightSquareStyle={{
          backgroundColor: "#f0ecec",
        }}
        customPieces={customPieces}
        boardOrientation={boardOrientation}
        areArrowsAllowed={true}
        showBoardNotation={true}
        customSquareStyles={customSquareStyles || {}}
        boardWidth={chessboardSize} // Set the chessboard size dynamically
      />

      {/* SVG Overlay for Custom Arrows */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Ensure clicks pass through to the chessboard
        }}
      >
        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="context-stroke" />
          </marker>
        </defs>

        {/* Render Arrows */}
        {arrows.map((arrow, index) => {
          const [fromSquare, toSquare, color] = arrow;
          const from = getSquareCoordinates(fromSquare);
          const to = getSquareCoordinates(toSquare);

          return (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default CustomChessboard;
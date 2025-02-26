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

const CustomChessboard = ({ fen, selectedSquare, onSquareClick, onPieceDrop, boardOrientation, customSquareStyles }) => {
  return (
    <div className="w-[40vw] h-[40vw]">
      <Chessboard
        id="defaultBoard"
        position={fen}
        onSquareClick={onSquareClick}
        onPieceDrop={onPieceDrop}
        customBoardStyle={{
          borderRadius: "0.25rem",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#888c94",
        }}
        customLightSquareStyle={{
          backgroundColor: "#f0ecec",
        }}
        customPieces={customPieces}
        boardOrientation={boardOrientation}
        areArrowsAllowed={false}
        showBoardNotation={true}
        customSquareStyles={customSquareStyles}
      />
    </div>
  );
};

export default CustomChessboard;
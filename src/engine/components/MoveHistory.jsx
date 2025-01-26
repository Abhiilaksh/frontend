/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { toast } from "react-hot-toast";

const MoveHistory = ({ moveHistory }) => {
  const [showPgn, setShowPgn] = useState(true);

  const toggleDisplay = (type) => {
    if (type === "pgn") {
      setShowPgn(true);
    } else {
      setShowPgn(false);
    }
  };

  const copyMoveHistory = () => {
    const formattedHistory = moveHistory
      .map((move, index) => `${index + 1}. ${showPgn ? move.move : move.fen}`)
      .join("\n");

    navigator.clipboard
      .writeText(formattedHistory)
      .then(() => {
        toast.success("Move history copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy move history:", error);
        toast.error("Failed to copy move history.");
      });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Move History</h2>

      <div className="flex mb-2">
        <button
          onClick={() => toggleDisplay("pgn")}
          className={`px-4 py-2 ${
            showPgn ? "bg-gray-300 text-black" : "bg-gray-600 text-white"
          }`}
        >
          PGN
        </button>
        <button
          onClick={() => toggleDisplay("fen")}
          className={`px-4 py-2 ${
            !showPgn ? "bg-gray-300 text-black" : "bg-gray-600 text-white"
          }`}
        >
          FEN
        </button>
      </div>

      <button
        onClick={copyMoveHistory}
        className="absolute top-4 right-2 px-4 py-2 text-white rounded"
      >
        <MdContentCopy />
      </button>

      <pre className="overflow-y-auto max-h-80 w-[28rem] flex flex-wrap gap-2 no-scrollbar">
        {moveHistory.map((move, index) => (
          <span
            key={index}
            className={`inline-block mr-4 ${
              index === moveHistory.length - 1
                ? "bg-gray-700 px-2 py-1 text-md rounded"
                : ""
            }`}
          >
            {index % 2 === 0 && (
              <span className="inline-block">{`${
                Math.floor(index / 2) + 1
              }.`}</span>
            )}

            <span>{showPgn ? move.move : move.fen}</span>
          </span>
        ))}
      </pre>
    </div>
  );
};

export default MoveHistory;

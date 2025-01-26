/* eslint-disable react/prop-types */
import { useState } from "react";

const DialogBox = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("random");
  const [timeType, setTimeType] = useState("bullet1");
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customIncrement, setCustomIncrement] = useState(0);
  const [playWithTime, setPlayWithTime] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let time = 0;
    let increment = 0;

    // Handle different time control options
    switch (timeType) {
      case "bullet1":
        time = 1; 
        increment = 0;
        break;
      case "bullet2":
        time = 2; 
        increment = 1; 
        break;
      case "blitz3":
        time = 3;
        increment = 0;
        break;
      case "blitz3_2":
        time = 3;
        increment = 2;
        break;
      case "blitz5":
        time = 5;
        increment = 0;
        break;
      case "blitz5_3":
        time = 5;
        increment = 3;
        break;
      case "rapid10":
        time = 10;
        increment = 0;
        break;
      case "rapid10_5":
        time = 10;
        increment = 5;
        break;
      case "rapid15":
        time = 15;
        increment = 10;
        break;
      case "classical30":
        time = 30;
        increment = 0;
        break;
      case "classical30_20":
        time = 30;
        increment = 20;
        break;
      case "custom":
        time = Number(customMinutes);
        increment = Number(customIncrement);
        break;
      default:
        time = 0;
        increment = 0;
        break;
    }

    let playerColor = color;
    if (color === "random") {
      playerColor = Math.random() < 0.5 ? "black" : "white";
    }

    const player = {
      name: name,
      type: timeType,
      time: time,
      increment: increment,
      player: playerColor,
      playWithTime: playWithTime,
    };

    onSubmit(player);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Chess Game Setup
        </h2>
        <div className="mb-4">
          <label className="block text-black">Player Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-black">Player Color:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
            required
          >
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="random">Random</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-black">
            <input
              type="checkbox"
              checked={playWithTime}
              onChange={(e) => setPlayWithTime(e.target.checked)}
              className="mr-2"
            />
            Play using time rules
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-black">Time Control:</label>
          <select
            value={timeType}
            onChange={(e) => setTimeType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
            required
          >
            <optgroup label="Bullet">
              <option value="bullet1">Bullet 1+0</option>
              <option value="bullet2">Bullet 2+1</option>
            </optgroup>
            <optgroup label="Blitz">
              <option value="blitz3">Blitz 3+0</option>
              <option value="blitz3_2">Blitz 3+2</option>
              <option value="blitz5">Blitz 5+0</option>
              <option value="blitz5_3">Blitz 5+3</option>
            </optgroup>
            <optgroup label="Rapid">    
              <option value="rapid10">Rapid 10+0</option>
              <option value="rapid10_5">Rapid 10+5</option>
              <option value="rapid15">Rapid 15+10</option>
            </optgroup>
            <optgroup label="Classical">
              <option value="classical30">Classical 30+0</option>
              <option value="classical30_20">Classical 30+20</option>
            </optgroup>
            <option value="custom">Custom</option>
          </select>
        </div>
        {timeType === "custom" && (
          <div className="mb-4 flex items-center justify-between">
            <div className="w-1/2 pr-2">
              <label className="block text-black">Minutes:</label>
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                min="0"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-black">Increment (seconds):</label>
              <input
                type="number"
                value={customIncrement}
                onChange={(e) => setCustomIncrement(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
                min="0"
                required
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default DialogBox;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Full from "./landing/Full";
import PlayWithEngine from "./engine/PlayWithEngine";

function App() {
  return (
    <BrowserRouter>
      <div
        className='bg-[#121212] h-[100vh] w-[100vw] text-white'
      >
        <Routes>
          <Route path="/" element={<Full />} />
          <Route path="/chess" element={<PlayWithEngine />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
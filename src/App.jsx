import PlayWithEngine from "./engine/PlayWithEngine";

function App() {

  return (
    <div
    className='
        bg-[#121212]
        h-[100vh]
        w-[100vw]
        text-white
    '
    >
      <h1>Chess App</h1>
      <PlayWithEngine />
    </div>
  )
}

export default App

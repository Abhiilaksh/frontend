import { Toaster } from 'react-hot-toast';
import ChessGame from "./components/ChessGame";

import { useState } from 'react';

const PlayWithEngine = () => {

    const [playerData, setPlayerData] = useState(null);

    return ( 
        <div>
            <Toaster />
            <h2>Play with Engine</h2>
            <ChessGame playerData={playerData}/>
        </div>
    );
}
 
export default PlayWithEngine;
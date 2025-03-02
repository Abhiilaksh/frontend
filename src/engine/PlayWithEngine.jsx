import { Toaster } from 'react-hot-toast';
import ChessGame from "./components/ChessGame";

import { useState } from 'react';

const PlayWithEngine = () => {

    const [playerData, setPlayerData] = useState(null);

    return ( 
        <div>
            <Toaster />
            <ChessGame playerData={playerData}/>
        </div>
    );
}
 
export default PlayWithEngine;
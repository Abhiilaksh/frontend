import { Toaster } from 'react-hot-toast';
import GamePage from "./components/GamePage";
import DialogBox from './components/DialogBox';

import { useState } from 'react';

const PlayWithEngine = () => {

    const [playerData, setPlayerData] = useState(null);

    const handleDialogSubmit = (data) => {
        setPlayerData(data);
        console.log("Player Data:", data);
    };

    return ( 
        <div>

            {playerData == null && <DialogBox  onSubmit={handleDialogSubmit} />}
            <Toaster />
            <h2>Play with Engine</h2>
            <GamePage playerData={playerData}/>
        </div>
    );
}
 
export default PlayWithEngine;

import { Toaster } from 'react-hot-toast';

import GamePage from "./GamePage";


const PlayWithEngine = () => {
    return ( 
        <>
            <Toaster />
            <h2>Play with Engine</h2>
            <GamePage />
        </>
    );
}
 
export default PlayWithEngine;
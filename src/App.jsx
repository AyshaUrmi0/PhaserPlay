import  { useState } from "react";
import Game from "./components/Game";
import { buttonConfig } from "./config/button-config";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div style={{ textAlign: "center" }}>
      {!gameStarted && (
        <button
          onClick={() => setGameStarted(true)}
          style={buttonConfig.buttonStyle}
        >
          {buttonConfig.buttonText}
        </button>
      )}
      {gameStarted && <Game />}
    </div>
  );
};

export default App;

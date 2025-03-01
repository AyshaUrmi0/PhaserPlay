
import { buttonConfig } from "../config/button-config"; 

const GameButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={buttonConfig.buttonStyle}>
      {buttonConfig.buttonText}
    </button>
  );
};

export default GameButton;

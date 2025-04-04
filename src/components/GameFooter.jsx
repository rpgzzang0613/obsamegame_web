import './GameFooter.css';
import {zeroPad} from '../utils/formatUtils.js';

const GameFooter = ({
  handleNewGame,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  score,
  remain,
}) => {
  return (
    <div className="game-footer">
      <div className="footer-section">
        <div className="btn-container">
          <button className="btn-new" onClick={handleNewGame}>
            <span>New Game</span>
          </button>
          <div className="controls">
            <button className="btn-history" onClick={handleUndo} disabled={historyIndex === 0}>
              <span>Undo</span>
            </button>
            <button
              className="btn-history"
              onClick={handleRedo}
              disabled={historyIndex === historyLength - 1}
            >
              <span>Redo</span>
            </button>
          </div>
        </div>
      </div>
      <div className="footer-section">
        <div className="display-container">
          <div className="display">
            <span className="label">Remains :&nbsp;</span>
            <span className="digital">{zeroPad(remain, 3)}</span>
          </div>
          <div className="display">
            <span className="label">Score :&nbsp;</span>
            <span className="digital">{zeroPad(score, 4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFooter;

import styles from './GamePanel.module.css';
import {zeroPad} from '../../../utils/formatUtils.js';

const GamePanel = ({
  handleRestart,
  handleUndo,
  handleRedo,
  historyIndex,
  historyLength,
  score,
  remain,
}) => {
  return (
    <div className={styles.gamePanel}>
      <div className={styles.section}>
        <div className={styles.btnContainer}>
          <button className={styles.btnNew} onClick={handleRestart}>
            <span>New Game</span>
          </button>
          <div className={styles.controls}>
            <button
              className={styles.btnHistory}
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              <span>Undo</span>
            </button>
            <button
              className={styles.btnHistory}
              onClick={handleRedo}
              disabled={historyIndex === historyLength - 1}
            >
              <span>Redo</span>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.displayContainer}>
          <div className={styles.display}>
            <span className={styles.label}>Remains :&nbsp;</span>
            <span className={styles.digital}>{zeroPad(remain, 3)}</span>
          </div>
          <div className={styles.display}>
            <span className={styles.label}>Score :&nbsp;</span>
            <span className={styles.digital}>{zeroPad(score, 4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;

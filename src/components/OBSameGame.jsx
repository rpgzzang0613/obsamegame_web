import {useEffect, useCallback, useState, useRef} from 'react';
import {findConnectedBlocks} from '../utils/boardUtils.js';
import GameBoard from './GameScreen/GameBoard/GameBoard.jsx';
import GamePanel from './GameScreen/GamePanel/GamePanel.jsx';
import styles from './OBSameGame.module.css';
import TitleBar from './TitleBar/TitleBar.jsx';
import SoundToggle from './GameScreen/SoundToggle.jsx';
import {useGameState} from '../hooks/useGameState.jsx';
import {preloadTileSounds} from '../utils/soundUtils.js';
import {tileImages} from '../utils/tileImages.js';
import bgm from '../assets/sounds/bgm.mp3';

const OBSameGame = () => {
  const {
    curBoard,
    curScore,
    curRemain,
    hoveredGroup,
    setHoveredGroup,
    handleClick,
    handleRestart,
    handleUndo,
    handleRedo,
    historyIndex,
    historyLength,
  } = useGameState();

  useEffect(() => {
    preloadTileSounds();
  }, []);

  const handleMouseMove = useCallback(
    e => {
      const tileElement = e.target;

      // Check if the class name includes 'tile' instead of exact match
      if (!Array.from(tileElement.classList).some(className => className.includes('tile'))) {
        return;
      }

      const rowIndex = parseInt(tileElement.dataset.rowIndex);
      const colIndex = parseInt(tileElement.dataset.colIndex);

      const target = curBoard[rowIndex][colIndex];
      const group = findConnectedBlocks(curBoard, rowIndex, colIndex, target);

      setHoveredGroup(group.length > 1 ? group : []);
    },
    [curBoard]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const [isStarted, setIsStarted] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);

  const bgmRef = useRef(null);

  return (
    <div className={styles.obSameGame}>
      <TitleBar
        setIsBgmOn={setIsBgmOn}
        isStarted={isStarted}
        setIsStarted={setIsStarted}
        bgmRef={bgmRef}
        handleRestart={handleRestart}
      />
      {isStarted ? (
        <div className={styles.gameContainer}>
          <div className={styles.gameScreen}>
            <GameBoard
              board={curBoard}
              hoveredGroup={hoveredGroup}
              tileImages={tileImages}
              handleClick={handleClick}
            />
            <GamePanel
              handleRestart={handleRestart}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              historyIndex={historyIndex}
              historyLength={historyLength}
              score={curScore}
              remain={curRemain}
            />
          </div>
          <SoundToggle isBgmOn={isBgmOn} setIsBgmOn={setIsBgmOn} bgmRef={bgmRef} />
        </div>
      ) : (
        <div className={styles.readyContainer}>
          <div className={styles.left}>
            <button
              type="button"
              onClick={() => {
                setIsStarted(true);
                setIsBgmOn(true);
                bgmRef.current.play();
              }}
            >
              시작
            </button>
          </div>
          <div className={styles.right}></div>
        </div>
      )}
      <audio ref={bgmRef} loop>
        <source src={bgm} type="audio/mp3" />
        브라우저가 audio 태그를 지원하지 않아 bgm 재생이 불가합니다.
      </audio>
    </div>
  );
};

export default OBSameGame;

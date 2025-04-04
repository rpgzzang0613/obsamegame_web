import {useEffect, useCallback} from 'react';
import {findConnectedBlocks} from '../utils/boardUtils.js';
import GameContent from './GameContent.jsx';
import GameFooter from './GameFooter.jsx';
import './OBSameGame.css';
import GameHeader from './GameHeader.jsx';
import SoundControl from './SoundControl.jsx';
import {useGameState} from '../hooks/useGameState.jsx';
import {preloadTileSounds} from '../utils/soundUtils.js';
import {tileImages} from '../utils/tileImages.js';

// 보드 크기
const ROWS = 10;
const COLS = 20;

const OBSameGame = () => {
  const {
    curBoard,
    curScore,
    curRemain,
    hoveredGroup,
    setHoveredGroup,
    handleClick,
    handleNewGame,
    handleUndo,
    handleRedo,
    historyIndex,
    historyLength,
  } = useGameState(ROWS, COLS);

  useEffect(() => {
    preloadTileSounds();
  }, []);

  const handleMouseMove = useCallback(
    e => {
      const tileElement = e.target;

      if (!tileElement.classList.contains('tile')) {
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

  return (
    <div className="game-container">
      <GameHeader />
      <div className="bg-lager">
        <GameContent
          board={curBoard}
          hoveredGroup={hoveredGroup}
          tileImages={tileImages}
          handleClick={handleClick}
        />
        <GameFooter
          handleNewGame={handleNewGame}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          historyIndex={historyIndex}
          historyLength={historyLength}
          score={curScore}
          remain={curRemain}
        />
      </div>
      <SoundControl />
    </div>
  );
};

export default OBSameGame;

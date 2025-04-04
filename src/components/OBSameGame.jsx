import {useState, useEffect, useCallback, useRef} from 'react';
import {
  generateBoard,
  findConnectedBlocks,
  applyGravity,
  hasRemovableBlocks,
  playTileSound,
  playEndSound,
  preloadTileSounds,
} from '../utils/Utils';
import tile_1_1 from '../assets/images/tile_1_1.png';
import tile_1_2 from '../assets/images/tile_1_2.png';
import tile_2_1 from '../assets/images/tile_2_1.png';
import tile_2_2 from '../assets/images/tile_2_2.png';
import tile_3_1 from '../assets/images/tile_3_1.png';
import tile_3_2 from '../assets/images/tile_3_2.png';
import tile_4_1 from '../assets/images/tile_4_1.png';
import tile_4_2 from '../assets/images/tile_4_2.png';
import tile_5_1 from '../assets/images/tile_5_1.png';
import tile_5_2 from '../assets/images/tile_5_2.png';
import GameContent from './GameContent.jsx';
import GameFooter from './GameFooter.jsx';
import './OBSameGame.css';
import GameHeader from './GameHeader.jsx';
import SoundControl from './SoundControl.jsx';

// 이미지 매핑
const tileImages = {
  1: {normal: tile_1_1, hover: tile_1_2},
  2: {normal: tile_2_1, hover: tile_2_2},
  3: {normal: tile_3_1, hover: tile_3_2},
  4: {normal: tile_4_1, hover: tile_4_2},
  5: {normal: tile_5_1, hover: tile_5_2},
};

// 보드 크기
const ROWS = 10;
const COLS = 20;

const OBSameGame = () => {
  const historyIndexRef = useRef(0);

  const boardHistoryRef = useRef([generateBoard(ROWS, COLS)]);
  const scoreHistoryRef = useRef([0]);
  const remainHistoryRef = useRef([ROWS * COLS]);

  const [curBoard, setCurBoard] = useState(boardHistoryRef.current[0]);
  const [curScore, setCurScore] = useState(scoreHistoryRef.current[0]);
  const [curRemain, setCurRemain] = useState(remainHistoryRef.current[0]);

  const [hoveredGroup, setHoveredGroup] = useState([]);

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

  const handleClick = (row, col) => {
    const target = curBoard[row][col];
    const group = findConnectedBlocks(curBoard, row, col, target);

    if (group.length < 2) {
      return;
    }

    let newBoard = curBoard.map(row => [...row]);

    playTileSound(target);

    group.forEach(([r, c]) => (newBoard[r][c] = 0));

    newBoard = applyGravity(newBoard);

    const newIndex = historyIndexRef.current + 1;
    boardHistoryRef.current = boardHistoryRef.current.slice(0, newIndex).concat([newBoard]);
    scoreHistoryRef.current = scoreHistoryRef.current
      .slice(0, newIndex)
      .concat([curScore + (group.length - 2) ** 2]);
    remainHistoryRef.current = remainHistoryRef.current
      .slice(0, newIndex)
      .concat([curRemain - group.length]);
    historyIndexRef.current = newIndex;

    setCurBoard(newBoard);
    setCurScore(scoreHistoryRef.current[newIndex]);
    setCurRemain(remainHistoryRef.current[newIndex]);
    setHoveredGroup([]);

    if (!hasRemovableBlocks(newBoard)) {
      playEndSound();
      setTimeout(
        () => alert(`Game Over! Your final score: ${scoreHistoryRef.current[newIndex]}`),
        300
      );
    }
  };

  const handleNewGame = () => {
    const newBoard = generateBoard(ROWS, COLS);
    const newRemain = ROWS * COLS;

    boardHistoryRef.current = [newBoard];
    scoreHistoryRef.current = [0];
    remainHistoryRef.current = [newRemain];
    historyIndexRef.current = 0;

    setCurBoard(newBoard);
    setCurScore(0);
    setCurRemain(newRemain);
    setHoveredGroup([]);
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;

      const newIndex = historyIndexRef.current;

      setCurBoard(boardHistoryRef.current[newIndex]);
      setCurScore(scoreHistoryRef.current[newIndex]);
      setCurRemain(remainHistoryRef.current[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < boardHistoryRef.current.length - 1) {
      historyIndexRef.current += 1;
      const newIndex = historyIndexRef.current;

      setCurBoard(boardHistoryRef.current[newIndex]);
      setCurScore(scoreHistoryRef.current[newIndex]);
      setCurRemain(remainHistoryRef.current[newIndex]);
    }
  };

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
          historyIndex={historyIndexRef.current}
          historyLength={boardHistoryRef.current.length}
          score={curScore}
          remain={curRemain}
        />
      </div>
      <SoundControl />
    </div>
  );
};

export default OBSameGame;

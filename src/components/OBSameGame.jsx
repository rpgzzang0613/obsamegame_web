import {useState, useEffect, useCallback} from 'react';
import {
  generateBoard,
  findConnectedBlocks,
  applyGravity,
  updateScoreAndRemains,
  hasRemovableBlocks, playTileSound, playEndSound,
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
import {SoundControl} from './SoundControl.jsx';

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
  const [board, setBoard] = useState(generateBoard(ROWS, COLS));
  const [hoveredGroup, setHoveredGroup] = useState([]);
  const [history, setHistory] = useState([board]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [remainingBlocks, setRemainingBlocks] = useState(ROWS * COLS);

  const handleMouseMove = useCallback(
    (e) => {
      const tileElement = e.target;

      if (!tileElement.classList.contains('tile')) return;

      const rowIndex = parseInt(tileElement.dataset.rowIndex);
      const colIndex = parseInt(tileElement.dataset.colIndex);

      const target = board[rowIndex][colIndex];
      const group = findConnectedBlocks(board, rowIndex, colIndex, target);

      if (group.length > 1) {
        setHoveredGroup(group);
      } else {
        setHoveredGroup([]);
      }
    },
    [board],
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleClick = (row, col) => {
    const target = board[row][col];
    const group = findConnectedBlocks(board, row, col, target);

    if (group.length < 2) return;

    let newBoard = board.map((row) => [...row]);

    playTileSound(target);

    group.forEach(([r, c]) => (newBoard[r][c] = 0));

    newBoard = applyGravity(newBoard);

    const newHistory = [...history.slice(0, historyIndex + 1), newBoard];

    setBoard(newBoard);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHoveredGroup([]);

    const newScore = score + (group.length - 2) ** 2;
    setScore(newScore);

    const newRemainingBlocks = remainingBlocks - group.length;
    setRemainingBlocks(newRemainingBlocks);

    if (!hasRemovableBlocks(newBoard)) {
      playEndSound();
      setTimeout(() => alert(`Game Over! Your final score: ${newScore}`), 300);
    }
  };

  const handleNewGame = () => {
    const newBoard = generateBoard(ROWS, COLS);
    setBoard(newBoard);
    setHistory([newBoard]);
    setHistoryIndex(0);
    setHoveredGroup([]);
    setScore(0);
    setRemainingBlocks(ROWS * COLS);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setBoard(history[newIndex]);
      setHistoryIndex(newIndex);

      const {tempScore, tempRemains} = updateScoreAndRemains(history, newIndex);
      setScore(tempScore);
      setRemainingBlocks(tempRemains);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setBoard(history[newIndex]);
      setHistoryIndex(newIndex);

      const {tempScore, tempRemains} = updateScoreAndRemains(history, newIndex);
      setScore(tempScore);
      setRemainingBlocks(tempRemains);
    }
  };

  return (
    <div className="game-container">
      <GameHeader />
      <div className="bg-lager">
        <GameContent
          board={board}
          hoveredGroup={hoveredGroup}
          tileImages={tileImages}
          handleClick={handleClick}
        />
        <GameFooter
          handleNewGame={handleNewGame}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          historyIndex={historyIndex}
          historyLength={history.length}
          score={score}
          remainingBlocks={remainingBlocks}
        />
      </div>
      <SoundControl />
    </div>
  );
};

export default OBSameGame;

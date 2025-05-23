import {useRef, useState} from 'react';
import {
  generateBoard,
  findConnectedBlocks,
  applyGravity,
  hasRemovableBlocks,
} from '../utils/boardUtils.js';
import {playEndSound, playTileSound} from '../utils/soundUtils.js';

export const useGameState = () => {
  const ROWS = 10;
  const COLS = 20;

  const indexRef = useRef(0); // 현재 index
  const historyRef = useRef([
    {
      board: generateBoard(ROWS, COLS),
      score: 0,
      remain: ROWS * COLS,
    },
  ]);

  const [curBoard, setCurBoard] = useState(historyRef.current[0].board); // 현재 index의 보드 상태
  const [curScore, setCurScore] = useState(historyRef.current[0].score); // 현재 index의 점수
  const [curRemain, setCurRemain] = useState(historyRef.current[0].remain); // 현재 index의 남은 타일 수

  const [hoveredGroup, setHoveredGroup] = useState([]);

  const handleClick = (row, col) => {
    const target = curBoard[row][col];
    const group = findConnectedBlocks(curBoard, row, col, target);

    if (group.length < 2) {
      return;
    }

    playTileSound(target);

    const newIndex = indexRef.current + 1;

    let newBoard = curBoard.map(row => [...row]);
    group.forEach(([r, c]) => (newBoard[r][c] = 0));
    newBoard = applyGravity(newBoard);

    const newScore = curScore + (group.length - 2) ** 2;
    const newRemain = curRemain - group.length;

    const newState = {
      board: newBoard,
      score: newScore,
      remain: newRemain,
    };

    historyRef.current = historyRef.current.slice(0, newIndex).concat([newState]);
    indexRef.current = newIndex;

    setCurBoard(newBoard);
    setCurScore(newScore);
    setCurRemain(newRemain);
    setHoveredGroup([]);

    if (!hasRemovableBlocks(newBoard)) {
      playEndSound();
      setTimeout(() => alert(`Game Over! Your final score: ${newScore}`), 300);
    }
  };

  const handleNewGame = () => {
    const newState = {
      board: generateBoard(ROWS, COLS),
      score: 0,
      remain: ROWS * COLS,
    };

    historyRef.current = [newState];
    indexRef.current = 0;

    setCurBoard(newState.board);
    setCurScore(0);
    setCurRemain(newState.remain);
    setHoveredGroup([]);
  };

  const handleUndo = () => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;

      const state = historyRef.current[indexRef.current];

      setCurBoard(state.board);
      setCurScore(state.score);
      setCurRemain(state.remain);
    }
  };

  const handleRedo = () => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      const state = historyRef.current[indexRef.current];

      setCurBoard(state.board);
      setCurScore(state.score);
      setCurRemain(state.remain);
    }
  };

  return {
    curBoard,
    curScore,
    curRemain,
    hoveredGroup,
    setHoveredGroup,
    handleClick,
    handleNewGame,
    handleUndo,
    handleRedo,
    historyIndex: indexRef.current,
    historyLength: historyRef.current.length,
  };
};

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

  const boardHistoryRef = useRef([generateBoard(ROWS, COLS)]); // 보드 히스토리
  const scoreHistoryRef = useRef([0]); // 점수 히스토리
  const remainHistoryRef = useRef([ROWS * COLS]); // 남은 타일 수 히스토리

  const [curBoard, setCurBoard] = useState(boardHistoryRef.current[0]); // 현재 index의 보드 상태
  const [curScore, setCurScore] = useState(scoreHistoryRef.current[0]); // 현재 index의 점수
  const [curRemain, setCurRemain] = useState(remainHistoryRef.current[0]); // 현재 index의 남은 타일 수

  const [hoveredGroup, setHoveredGroup] = useState([]);

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

    const newIndex = indexRef.current + 1;
    boardHistoryRef.current = boardHistoryRef.current.slice(0, newIndex).concat([newBoard]);
    scoreHistoryRef.current = scoreHistoryRef.current
      .slice(0, newIndex)
      .concat([curScore + (group.length - 2) ** 2]);
    remainHistoryRef.current = remainHistoryRef.current
      .slice(0, newIndex)
      .concat([curRemain - group.length]);
    indexRef.current = newIndex;

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
    indexRef.current = 0;

    setCurBoard(newBoard);
    setCurScore(0);
    setCurRemain(newRemain);
    setHoveredGroup([]);
  };

  const handleUndo = () => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;

      const newIndex = indexRef.current;

      setCurBoard(boardHistoryRef.current[newIndex]);
      setCurScore(scoreHistoryRef.current[newIndex]);
      setCurRemain(remainHistoryRef.current[newIndex]);
    }
  };

  const handleRedo = () => {
    if (indexRef.current < boardHistoryRef.current.length - 1) {
      indexRef.current += 1;
      const newIndex = indexRef.current;

      setCurBoard(boardHistoryRef.current[newIndex]);
      setCurScore(scoreHistoryRef.current[newIndex]);
      setCurRemain(remainHistoryRef.current[newIndex]);
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
    historyLength: boardHistoryRef.current.length,
  };
};

import tileSound_1 from "../assets/sounds/tile_1.mp3";
import tileSound_2 from "../assets/sounds/tile_2.mp3";
import tileSound_3 from "../assets/sounds/tile_3.mp3";
import tileSound_4 from "../assets/sounds/tile_4.mp3";
import tileSound_5 from "../assets/sounds/tile_5.mp3";
import endSound from "../assets/sounds/end.mp3";

export const generateBoard = (ROWS = 10, COLS = 20) => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Math.floor(Math.random() * 5) + 1)
  );
};

export const findConnectedBlocks = (board, row, col, target, visited = new Set()) => {
  let key = `${row},${col}`;
  if (
    row < 0 || row >= board.length || col < 0 || col >= board[0].length ||
    board[row][col] !== target || visited.has(key)
  ) {
    return [];
  }

  visited.add(key);
  let group = [[row, col]];

  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
    group.push(...findConnectedBlocks(board, row + dr, col + dc, target, visited));
  });

  return group;
};

export const applyGravity = (board, ROWS = 10, COLS = 20) => {
  for (let col = 0; col < COLS; col++) {
    let writeRow = ROWS - 1;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] !== 0) {
        if (row !== writeRow) {
          board[writeRow][col] = board[row][col];
          board[row][col] = 0;
        }
        writeRow--;
      }
    }
  }

  let writeCol = 0;
  for (let col = 0; col < COLS; col++) {
    if (board[ROWS - 1][col] !== 0) {
      if (col !== writeCol) {
        for (let row = 0; row < ROWS; row++) {
          board[row][writeCol] = board[row][col];
          board[row][col] = 0;
        }
      }
      writeCol++;
    }
  }

  return board;
};

export const zeroPad = (num, places) => {
  return String(num).padStart(places, '0');
};

export const hasRemovableBlocks = (board) => {
  const ROWS = board.length;
  const COLS = board[0].length;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const target = board[row][col];
      if (target !== 0) {
        const group = findConnectedBlocks(board, row, col, target);
        if (group.length > 1) return true;
      }
    }
  }
  return false;
};

export const countRemovedBlocks = (prevBoard, currBoard) => {
  let count = 0;
  for (let row = 0; row < prevBoard.length; row++) {
    for (let col = 0; col < prevBoard[row].length; col++) {
      if (prevBoard[row][col] !== 0 && currBoard[row][col] === 0) {
        count++;
      }
    }
  }
  return count;
};

export const updateScoreAndRemains = (history, index) => {
  let tempScore = 0;
  let tempRemains = history[0].length * history[0][0].length;

  for (let i = 1; i <= index; i++) {
    const prevBoard = history[i - 1];
    const currBoard = history[i];

    const removedCount = countRemovedBlocks(prevBoard, currBoard);
    tempRemains -= removedCount;
    tempScore += (removedCount - 2) ** 2;
  }

  return { tempScore, tempRemains };
};

export const playTileSound = tileNumber => {
  let sound;

  switch (tileNumber) {
    case 1:
      sound = new Audio(tileSound_1);
      break;
    case 2:
      sound = new Audio(tileSound_2);
      break;
    case 3:
      sound = new Audio(tileSound_3);
      break;
    case 4:
      sound = new Audio(tileSound_4);
      break;
    case 5:
      sound = new Audio(tileSound_5);
      break;
    default:
      return;
  }

  sound.play()
    .then(r => console.log(r))
    .catch((error) => {
    console.error('Failed to load sound:', error);
  });
};

export const playEndSound = () => {
  const sound = new Audio(endSound);
  sound.play()
    .then(r => console.log(r))
    .catch((error) => {
    console.error('Failed to load sound:', error);
  });
};

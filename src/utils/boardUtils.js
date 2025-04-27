/**
 * 게임 보드 랜덤 생성 함수
 */
export const generateBoard = (ROWS = 10, COLS = 20) => {
  return Array.from({length: ROWS}, () =>
    Array.from({length: COLS}, () => Math.floor(Math.random() * 5) + 1)
  );
};

/**
 * 타겟 타일과 연결된 동일한 타일 그룹 찾는 함수
 */
export const findConnectedBlocks = (board, row, col, target, visited = new Set()) => {
  let key = `${row},${col}`;
  if (
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length ||
    board[row][col] !== target ||
    visited.has(key)
  ) {
    return [];
  }

  visited.add(key);
  let group = [[row, col]];

  [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].forEach(([dr, dc]) => {
    group.push(...findConnectedBlocks(board, row + dr, col + dc, target, visited));
  });

  return group;
};

/**
 * 타일 제거시 기존 타일이 빈 자리를 채우도록 정렬하는 함수
 */
export const applyGravity = (board, ROWS = 10, COLS = 20) => {  // Create a deep copy of the board to avoid modifying the original
  const newBoard = board.map(row => [...row]);

  for (let col = 0; col < COLS; col++) {
    let writeRow = ROWS - 1;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] !== 0) {
        if (row !== writeRow) {
          newBoard[writeRow][col] = newBoard[row][col];
          newBoard[row][col] = 0;
        }
        writeRow--;
      }
    }
  }

  let writeCol = 0;
  for (let col = 0; col < COLS; col++) {
    if (newBoard[ROWS - 1][col] !== 0) {
      if (col !== writeCol) {
        for (let row = 0; row < ROWS; row++) {
          newBoard[row][writeCol] = newBoard[row][col];
          newBoard[row][col] = 0;
        }
      }
      writeCol++;
    }
  }

  return newBoard;
};

/**
 * 보드에 제거 가능한 타일이 있는지 확인하는 함수
 */
export const hasRemovableBlocks = board => {
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

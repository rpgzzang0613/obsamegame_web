import styles from './GameBoard.module.css';

const GameBoard = ({board, hoveredGroup, tileImages, handleClick}) => {
  return (
    <div className={styles.gameBoard}>
      {board.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const isHovered = hoveredGroup.some(([r, c]) => r === rowIndex && c === colIndex);
          const imgSrc =
            tile === 0 ? null : isHovered ? tileImages[tile].hover : tileImages[tile].normal;

          return (
            <img
              key={`${rowIndex}-${colIndex}`}
              src={imgSrc}
              alt={`Tile ${tile}`}
              className={styles.tile}
              data-row-index={rowIndex}
              data-col-index={colIndex}
              onClick={() => handleClick(rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard;

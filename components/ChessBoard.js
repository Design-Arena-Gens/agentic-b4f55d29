import { useState, useEffect } from 'react';
import { initializeBoard, isValidMove, getPieceSymbol, COLORS, isInCheck, isCheckmate } from '../utils/chess';
import styles from '../styles/ChessBoard.module.css';

export default function ChessBoard() {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(COLORS.WHITE);
  const [validMoves, setValidMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  useEffect(() => {
    if (isCheckmate(board, currentPlayer)) {
      const winner = currentPlayer === COLORS.WHITE ? 'Black' : 'White';
      setGameStatus(`Checkmate! ${winner} wins!`);
    } else if (isInCheck(board, currentPlayer)) {
      setGameStatus(`${currentPlayer === COLORS.WHITE ? 'White' : 'Black'} is in check!`);
    } else {
      setGameStatus(null);
    }
  }, [board, currentPlayer]);

  const handleSquareClick = (row, col) => {
    if (gameStatus && gameStatus.includes('Checkmate')) return;

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;

      if (isValidMove(board, selectedRow, selectedCol, row, col, currentPlayer)) {
        const newBoard = board.map(r => [...r]);
        const movingPiece = newBoard[selectedRow][selectedCol];
        const capturedPiece = newBoard[row][col];

        newBoard[row][col] = movingPiece;
        newBoard[selectedRow][selectedCol] = null;

        if (!isInCheck(newBoard, currentPlayer)) {
          if (capturedPiece) {
            setCapturedPieces(prev => ({
              ...prev,
              [capturedPiece.color]: [...prev[capturedPiece.color], capturedPiece]
            }));
          }

          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE);
        }
      }

      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);

        const moves = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (isValidMove(board, row, col, r, c, currentPlayer)) {
              const testBoard = board.map(row => [...row]);
              testBoard[r][c] = testBoard[row][col];
              testBoard[row][col] = null;

              if (!isInCheck(testBoard, currentPlayer)) {
                moves.push([r, c]);
              }
            }
          }
        }
        setValidMoves(moves);
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setCurrentPlayer(COLORS.WHITE);
    setValidMoves([]);
    setGameStatus(null);
    setCapturedPieces({ white: [], black: [] });
  };

  const isHighlighted = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameInfo}>
        <h1>Chess Game</h1>
        <p className={styles.turnIndicator}>
          Current Turn: <strong>{currentPlayer === COLORS.WHITE ? 'White' : 'Black'}</strong>
        </p>
        {gameStatus && (
          <p className={gameStatus.includes('Checkmate') ? styles.checkmate : styles.check}>
            {gameStatus}
          </p>
        )}
        <button onClick={resetGame} className={styles.resetButton}>New Game</button>
      </div>

      <div className={styles.gameArea}>
        <div className={styles.capturedSection}>
          <h3>Captured by White</h3>
          <div className={styles.capturedPieces}>
            {capturedPieces.black.map((piece, idx) => (
              <span key={idx} className={styles.capturedPiece}>{getPieceSymbol(piece)}</span>
            ))}
          </div>
        </div>

        <div className={styles.boardContainer}>
          <div className={styles.board}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((piece, colIndex) => {
                  const isDark = (rowIndex + colIndex) % 2 === 1;
                  const isHighlightedSquare = isHighlighted(rowIndex, colIndex);
                  const isSelectedSquare = isSelected(rowIndex, colIndex);

                  return (
                    <div
                      key={colIndex}
                      className={`${styles.square} ${isDark ? styles.dark : styles.light} ${
                        isHighlightedSquare ? styles.highlighted : ''
                      } ${isSelectedSquare ? styles.selected : ''}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {piece && (
                        <span className={styles.piece}>
                          {getPieceSymbol(piece)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.capturedSection}>
          <h3>Captured by Black</h3>
          <div className={styles.capturedPieces}>
            {capturedPieces.white.map((piece, idx) => (
              <span key={idx} className={styles.capturedPiece}>{getPieceSymbol(piece)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chess game logic
export const PIECES = {
  PAWN: 'p',
  KNIGHT: 'n',
  BISHOP: 'b',
  ROOK: 'r',
  QUEEN: 'q',
  KING: 'k'
};

export const COLORS = {
  WHITE: 'w',
  BLACK: 'b'
};

export function initializeBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Black pieces
  board[0][0] = { type: PIECES.ROOK, color: COLORS.BLACK };
  board[0][1] = { type: PIECES.KNIGHT, color: COLORS.BLACK };
  board[0][2] = { type: PIECES.BISHOP, color: COLORS.BLACK };
  board[0][3] = { type: PIECES.QUEEN, color: COLORS.BLACK };
  board[0][4] = { type: PIECES.KING, color: COLORS.BLACK };
  board[0][5] = { type: PIECES.BISHOP, color: COLORS.BLACK };
  board[0][6] = { type: PIECES.KNIGHT, color: COLORS.BLACK };
  board[0][7] = { type: PIECES.ROOK, color: COLORS.BLACK };
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: PIECES.PAWN, color: COLORS.BLACK };
  }

  // White pieces
  for (let i = 0; i < 8; i++) {
    board[6][i] = { type: PIECES.PAWN, color: COLORS.WHITE };
  }
  board[7][0] = { type: PIECES.ROOK, color: COLORS.WHITE };
  board[7][1] = { type: PIECES.KNIGHT, color: COLORS.WHITE };
  board[7][2] = { type: PIECES.BISHOP, color: COLORS.WHITE };
  board[7][3] = { type: PIECES.QUEEN, color: COLORS.WHITE };
  board[7][4] = { type: PIECES.KING, color: COLORS.WHITE };
  board[7][5] = { type: PIECES.BISHOP, color: COLORS.WHITE };
  board[7][6] = { type: PIECES.KNIGHT, color: COLORS.WHITE };
  board[7][7] = { type: PIECES.ROOK, color: COLORS.WHITE };

  return board;
}

export function isValidMove(board, fromRow, fromCol, toRow, toCol, currentPlayer) {
  const piece = board[fromRow][fromCol];

  if (!piece || piece.color !== currentPlayer) return false;
  if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;

  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === currentPlayer) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const absRowDiff = Math.abs(rowDiff);
  const absColDiff = Math.abs(colDiff);

  switch (piece.type) {
    case PIECES.PAWN:
      const direction = piece.color === COLORS.WHITE ? -1 : 1;
      const startRow = piece.color === COLORS.WHITE ? 6 : 1;

      if (colDiff === 0 && !targetPiece) {
        if (rowDiff === direction) return true;
        if (fromRow === startRow && rowDiff === 2 * direction && !board[fromRow + direction][fromCol]) return true;
      }

      if (absColDiff === 1 && rowDiff === direction && targetPiece) return true;
      return false;

    case PIECES.KNIGHT:
      return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

    case PIECES.BISHOP:
      if (absRowDiff !== absColDiff) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);

    case PIECES.ROOK:
      if (rowDiff !== 0 && colDiff !== 0) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);

    case PIECES.QUEEN:
      if (rowDiff !== 0 && colDiff !== 0 && absRowDiff !== absColDiff) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);

    case PIECES.KING:
      return absRowDiff <= 1 && absColDiff <= 1;

    default:
      return false;
  }
}

function isPathClear(board, fromRow, fromCol, toRow, toCol) {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
}

export function isInCheck(board, color) {
  let kingPos = null;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PIECES.KING && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  const opponentColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        if (isValidMove(board, row, col, kingPos.row, kingPos.col, opponentColor)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isCheckmate(board, color) {
  if (!isInCheck(board, color)) return false;

  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, fromRow, fromCol, toRow, toCol, color)) {
              const newBoard = board.map(row => [...row]);
              newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
              newBoard[fromRow][fromCol] = null;

              if (!isInCheck(newBoard, color)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export function getPieceSymbol(piece) {
  if (!piece) return '';

  const symbols = {
    [PIECES.KING]: piece.color === COLORS.WHITE ? '♔' : '♚',
    [PIECES.QUEEN]: piece.color === COLORS.WHITE ? '♕' : '♛',
    [PIECES.ROOK]: piece.color === COLORS.WHITE ? '♖' : '♜',
    [PIECES.BISHOP]: piece.color === COLORS.WHITE ? '♗' : '♝',
    [PIECES.KNIGHT]: piece.color === COLORS.WHITE ? '♘' : '♞',
    [PIECES.PAWN]: piece.color === COLORS.WHITE ? '♙' : '♟'
  };

  return symbols[piece.type] || '';
}

const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

const encodeParams = (params) => {
  Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');
}

export async function getSolution(board) {
  const solResponse = await fetch('https://sugoku.herokuapp.com/solve', {
    method: 'POST',
    body: encodeParams({ board: board }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  const solution = (await solResponse.json()).solution
  return solution
}

export async function getBoard(difficulty) {
  const response = await fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
  const board = (await response.json()).board
  const solution = (await getSolution(board))
  return { board, solution }
}
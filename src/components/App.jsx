import './App.css';
import React, { useEffect, useState } from 'react';
import Board from './Board';
import { AppBar, Backdrop, Button, capitalize, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import produce from "immer";

const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')

const encodeParams = (params) =>
  Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

const difficulties = ['easy', 'medium', 'hard', 'random']

const buildGame = (board, solvedBoard, difficulty) => {
  if (board?.length > 0 && solvedBoard?.length > 0) {
    let game = board.map((row, rowIndex) => (
      {
        col: row.map((col, colIndex) => (
          {
            row: rowIndex,
            col: colIndex,
            flattenIndex: (rowIndex * 9 + colIndex),
            value: col,
            correct: false,
            readOnly: col > 0 ? true : false
          }
        )),
        index: rowIndex
      }
    ));
    return {
      gameboard: game,
      rawGameboard: board.flat(),
      solvedGame: solvedBoard.flat(),
      gameSolved: false,
      difficulty: difficulty
    }
  }
}

async function getGame(difficulty) {
  const firstResp = await fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`);
  const firstData = await firstResp.json();
  if(firstData.board) {
    const secResp = await fetch('https://sugoku.herokuapp.com/solve', {
      method: 'POST',
      body: encodeParams({ board: firstData.board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const secData = await secResp.json()
    var t = 0
    if(secData.solution) {
      const game = buildGame(firstData.board, secData.solution, difficulty)
      return game;
    }
  }
  return null;
}

function initialGameState(difficulty) {
  return({
      gameboard: [],
      rawGameboard: [],
      solvedGame: [],
      gameSolved: false,
      difficulty: difficulty
  })
}

function App() {
  const [difficulty, setDifficulty] = useState(difficulties[1])
  const [isLoading, setIsLoading] = useState(true)
  const [gameState, setGameState] = useState(() => initialGameState(difficulty))

  async function getBoard() {
    setIsLoading(true)
    setGameState(draft => {return initialGameState()})
    const newGame =  await getGame(difficulty, setIsLoading)
    const game = produce(gameState, draft => {
      draft.gameboard = newGame.gameboard;
      draft.rawGameboard = newGame.rawGameboard;
      draft.solvedGame = newGame.solvedGame;
      draft.gameSolved = newGame.gameSolved;
      draft.difficulty = draft.difficulty;
    })    
    setGameState(game);
    setIsLoading(false);
  }

  useEffect(() => getBoard(), [])


  const handleDiffChange = (event) => {
    setDifficulty(event.target.value)
  }

  const handleChange = (e) => {
    setGameState(
      produce(gameState => {
        //update state with incoming cell val
        gameState.gameboard[e.row].col[e.col].value = e.value;
        gameState.rawGameboard[e.flattenIndex] = e.value

        //check to see if board is correct now given val change
        var checkIfSolved = true;
        for(var i = 0; i < gameState.solvedGame.length; i++) {
          if(gameState.rawGameboard[i] !== gameState.solvedGame[i]) {
            checkIfSolved = false;
          }
        }
        gameState.gameSolved = checkIfSolved;

        //check to see if input val is correct for game
        const correct = (e.value === gameState.solvedGame[e.flattenIndex])

        //update cell obj so it reflect user put in the correct answer
        gameState.gameboard[e.row].col[e.col].correct = correct
      })
    )
  }

  const solveGame = (e) => {
    setGameState(
      produce(gameState => {
        gameState.gameboard.forEach(row =>
          row.col.forEach(cell => {
            if(!cell.readOnly) {
              cell.value = gameState.solvedGame[cell.flattenIndex]
            }
          })
          )
      })
    )
  }

  return (
    <div className="App">
      <AppBar position='static' sx={{ marginBottom: '25px' }}>
        <Toolbar>
          <Typography variant='h4' component={'div'} sx={{ flexGrow: 1 }}>
            M10 Sudoku
          </Typography>
        </Toolbar>
      </AppBar>
      <div className='mainContent' sx={{ minHeight: '80vh' }}>
        {console.log(gameState)}
        {(isLoading) ? 
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}>
            <Grid container direction='column' alignItems='center' justifyContent='center'>
              <Grid item paddingBottom='15px'><Typography varient='h2'>Generating Board</Typography></Grid>
              <Grid item><CircularProgress color="inherit" /></Grid>
            </Grid>
          </Backdrop>
          :
          <Grid container direction='column' alignContent='center' alignItems='center' justifyContent='center'>
            {(gameState.gameSolved) ? 
              <Grid item paddingBottom='15px'>
                <Typography variant='h3'>Congratulations on Solving the game!</Typography>
              </Grid> 
            : <Grid></Grid> }
            <Grid item paddingBottom='15px'>
              <Board game={gameState} action={handleChange} />
            </Grid>
            <Grid item container direction='row' alignContent='center' justifyContent='space-between'>
              <Grid item>
                <FormControl >
                  <InputLabel id="simple-select-label">Difficulty</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    value={difficulty}
                    label="Difficulty"
                    onChange={handleDiffChange}
                  >
                    {
                      difficulties.map((diff, index) => (
                        <MenuItem key={`diff_${index}`} value={difficulties[index]}>{capitalize(diff)}</MenuItem>
                      ))
                    }
                  </Select>
                  <FormHelperText>Choose Game's Difficulty</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <Button onClick={() => getBoard()} variant="contained" color="info">Generate New Game</Button>
              </Grid>
              <Grid item>
                <Button onClick={() => solveGame()} variant="contained" color="success">Solve Current Game</Button>
              </Grid>
            </Grid>
          </Grid>
        }
      </div>
    </div >
  );
}

export default App;

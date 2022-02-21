import {Grid} from "@mui/material";
import React from "react";
import SudokuCell from "./SudokuCell";
import { v4 as uuidv4 } from 'uuid';

export default function Board({ game, action }) {

  return (
    <div id='gameboard'>
      <Grid direction='column' alignContent='center' container>
        {game?.gameboard.map((row, rowIndex) => (
          <Grid direction='row' container key={()=> uuidv4()}> 
            {row?.col?.map((cell, colIndex) => (
              <Grid item key={()=> uuidv4()}>
                <SudokuCell cell={cell} update={action}/>
              </Grid>
            ))}
          </Grid>
        ))}
        
      </Grid>

    </div>
  );
}
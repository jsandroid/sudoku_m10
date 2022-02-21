import { Button, Grid, styled, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SudokuCell from "./SudokuCell";


export default function Board({ game, action }) {
  
  return (
    <div id='gameboard'>
      <Grid direction='column' alignContent='center' container>
        {game?.gameboard.map((row, rowIndex) => (
          <Grid direction='row' container > 
            {row.col.map((cell, colIndex) => (
              <Grid item >
                <SudokuCell cell={cell} update={action}/>
              </Grid>
            ))}
          </Grid>
        ))}
        
      </Grid>

    </div>
  );
}
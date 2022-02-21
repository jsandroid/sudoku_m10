import React, { useState } from "react";
import { styled, TextField } from "@mui/material";

const Cell = styled(TextField)(({ theme }) => ({
  width: '55px',
  height: '55px',
}),)



export default function SudokuCell({cell, action }) {
  
  function handleChange(e) {
    e.preventDefault();
    const value = "" ? null : parseInt(e.target.value);
    action({...cell, value}, e)
  }

  return(
    <Cell 
      onChange={handleChange} 
      inputProps={{style: { textAlign: 'center'}}} 
      value={(cell.value > 0) ? cell.value : null}
      disabled={cell.readOnly}>

    </Cell>

  )
}
import React from "react";
import { styled, TextField } from "@mui/material";

const Cell = styled(TextField)(({ theme }) => ({
  width: '55px',
  height: '55px', 
  '& .MuiOutlinedInput' : {

  } 
}),)



export default function SudokuCell({ cell, update }) {
  
  function handleChange(e) {
    e.preventDefault();
    const value = "" ? null : parseInt(e.target.value);
    update({...cell, value}, e)
  }

  return(
    <Cell 
      onChange={handleChange} 
      inputProps={{style: { textAlign: 'center', borderRadius: 0}}} 
      value={(cell.value > 0) ? cell.value : ""}
      disabled={cell.readOnly}
      error={(cell.value > 9 && cell.value > 0) ? true : false}
      jmsr={cell.answered}
      >
    </Cell>

  )
}
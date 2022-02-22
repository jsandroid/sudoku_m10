import React from "react";
import { styled, TextField } from "@mui/material";
import { red, green, grey } from "@mui/material/colors";

const Cell = styled(TextField,{
  shouldForwardProp: (prop) => prop !== 'cellcorrect' && prop !== 'prefilled' && prop !== 'cellindex' ,
})(({ cellcorrect, prefilled, cellindex, theme }) => ({
  width: '55px',
  height: '55px',
  
  '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: 0,
  },
  ...(prefilled === 'no' && cellcorrect === 'correctInput' && {
    backgroundColor: green[100],
    color: green[900],
  }),
  ...([0,3,6].indexOf(Math.floor(cellindex / 9)) > -1) && {
    borderTop: `1px solid ${grey[900]}`,
    borderRadius: 0,
  },
  ...(Math.floor(cellindex / 9) === 8) && {
    borderBottom: `1px  solid ${grey[900]}`,
    borderRadius: 0,
  },
  ...(cellindex % 9 === 0) && {
    borderLeft: `1px  solid ${grey[900]}`,
    borderRadius: 0,
  },
  ...([2,5,8].indexOf(cellindex % 9) > -1) && {
    borderRight: `1px  solid ${grey[900]}`,
    borderRadius: 0,
  }
}));




export default function SudokuCell({ cell, update }) {
  function handleChange(e) {
    e.preventDefault();
    const value = "" ? null : parseInt(e.target.value);
    update({ ...cell, value }, e)
  }

  return (
      <Cell
        onChange={handleChange}
        inputProps={{ style: { textAlign: 'center' } }}
        value={(cell.value > 0) ? cell.value : ""}
        disabled={cell.readOnly}
        error={(cell.value > 9 && cell.value > 0) ? true : false}
        prefilled = {(!cell.readOnly) ? 'no': ''}
        cellcorrect={(cell.correct) ? 'correctInput' :''}
        cellindex={cell.flattenIndex}
      />
  )
}


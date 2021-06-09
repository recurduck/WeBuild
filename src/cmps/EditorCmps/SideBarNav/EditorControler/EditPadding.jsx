import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles((theme) => ({

  root: {
    width: 150,
  },
  margin: {
    height: theme.spacing(0),
  },
}));

export function EditPadding({ att, val, onUpdateCurrCmp, currCmp }) {
  val = +(val.replace('px', ''))
  const [pad, setPadding] = useState(val);
  const classes = useStyles();

  const onHandleChange = async (event, newValue) => {
    const cmp = { ...currCmp, info: { ...currCmp.info, style: { ...currCmp.info.style, [att]: `${newValue}px` } } }
    await onUpdateCurrCmp(cmp)
    setPadding(newValue);
  }
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-always" gutterBottom>
        {(att === "paddingInline") ? "Side Spacing" : "Vertical Spacing"}
      </Typography>
      <Slider
        value={pad}
        onChange={onHandleChange}
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
      />
    </div>
  );
}
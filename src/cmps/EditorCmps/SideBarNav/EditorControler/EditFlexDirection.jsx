import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(0),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));

export function EditFlexDirection({val ,onUpdateCurrCmp ,currCmp }) {
  const classes = useStyles();

  const handleChange = async(event) => {
    const value = event.target.value;
    const cmp = {...currCmp,info:{...currCmp.info,style:{...currCmp.info.style,flexDirection:`${value}`}}}
    await onUpdateCurrCmp(cmp)
  
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={0} alignItems="center">
      <Box display="flex" alignItems='flex-start' flexDirection='column'>
        <Grid item>
          <Box mr={1}>
          <Typography id="input-slider" gutterBottom>
            Direction
          </Typography>
          </Box>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small" className={classes.formControl}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={val}
              onChange={handleChange}
              size="small"
            >
                <MenuItem value="column">Vertical</MenuItem>
                <MenuItem value="column-reverse">Vertical Reverse</MenuItem>
                <MenuItem value="row">Horizontal</MenuItem>
                <MenuItem value="row-reverse">Horizontal Reverse</MenuItem>            
            </Select>
          </FormControl>
         </Grid>
         </Box>
      </Grid>
    </div>
  );
}

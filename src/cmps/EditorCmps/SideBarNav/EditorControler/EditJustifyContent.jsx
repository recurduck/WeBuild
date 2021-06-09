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

export function EditJustifyContent({val ,onUpdateCurrCmp ,currCmp }) {
  const classes = useStyles();

  const handleChange = async(event) => {
    const value = event.target.value;
    const cmp = {...currCmp,info:{...currCmp.info,style:{...currCmp.info.style,justifyContent:`${value}`}}}
    await onUpdateCurrCmp(cmp)
  
  };


  return (
    <div className={classes.root}>
      <Grid container spacing={0} alignItems="center">
       <Box display="flex" alignItems='flex-start' flexDirection='column'>
         <Box mr={2} >
          <Typography id="input-slider" gutterBottom>
            Align position
          </Typography>
          </Box>
        <Grid item>
          <FormControl variant="outlined" size="small" className={classes.formControl}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={val}
              onChange={handleChange}
              size="small"
            >
                <MenuItem value="unset">Unset</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="flex-start">Begining</MenuItem>
                <MenuItem value="flex-end">End</MenuItem>
                <MenuItem value="space-around">Space Around</MenuItem>            
                <MenuItem value="space-between">Space between</MenuItem>            
                <MenuItem value="space-evenly">Space evenly</MenuItem>            
            </Select>
          </FormControl>
        </Grid>
        </Box>
      </Grid>
    </div>
  );
}

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
    marginBottom: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
}));

export function EditFontFamily({val ,onUpdateCurrCmp ,currCmp }) {
  const classes = useStyles();
  const handleChange = async(event) => {
    const value = event.target.value;
    const cmp = {...currCmp,info:{...currCmp.info,style:{...currCmp.info.style,fontFamily:`${value}`}}}
    await onUpdateCurrCmp(cmp)
  
  };

  return (
    <div className={classes.root}>
      <Box display="flex" alignItems='flex-start' flexDirection='column'>
        <Grid item>
          <Typography id="input-slider" gutterBottom>
            Font
          </Typography>
        </Grid>
        <Grid item>
          
          <FormControl variant="outlined" size="small" className={classes.formControl}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-required"
              value={val}
              onChange={handleChange}
              size="small"
            >
                <MenuItem value="Ariel">Ariel</MenuItem>
                <MenuItem value="New Time David">New Time David</MenuItem>
                <MenuItem value="roboto">Roboto</MenuItem>
                <MenuItem value="caveat">Caveat</MenuItem>
                <MenuItem value="montserrat_alternates">Montserrat</MenuItem>
                <MenuItem value="amatic_sc">Amatic</MenuItem>
                <MenuItem value="raleway">Raleway</MenuItem>
                <MenuItem value="source_code_pro">Source Code</MenuItem>
                <MenuItem value="OpenSans">OpenSans</MenuItem>
                <MenuItem value="staatliches">Staatliches</MenuItem>
                <MenuItem value="pacifico">Pacifico</MenuItem>
                <MenuItem value="nutino">Nutino</MenuItem>
                <MenuItem value="futura">Futura</MenuItem>
                <MenuItem value="courgette">Courgette</MenuItem>
                <MenuItem value="rubik">Rubik</MenuItem>
            
            </Select>
           
          </FormControl>
         </Grid>
         </Box>
    </div>
  );
}

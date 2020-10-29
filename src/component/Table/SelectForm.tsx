/*eslint-disable */
import React, {useState, }  from "react"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../../style/font.css'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 186,
        backgroundColor: 'white',
    },
}));

interface form_interface {
    name : string, label : string,
    options : any[], onChange(value:number) : any,
    value : string | number, disable? : any | null,
    width?: number
}

const SelectForm = ({name, label, options, onChange, value, disable = null, width = 33} : form_interface) => {
    const changeValue = event => onChange(event.target.value)
    const classes = useStyles()
    const content = <FormControl variant="outlined" className={classes.formControl} {
            ...{disabled : (disable == null) ? false : disable()}}>
            <InputLabel htmlFor="outlined-age-native-simple">{label}</InputLabel>
            <Select
                value={value}
                onChange={changeValue}
                label={label}
                inputProps={{
                    name, id: 'outlined-age-native-simple',
                }}>
            {options.map((data, idx) => <MenuItem value={data['value']} key={idx}>{data['label']}</MenuItem>)}
            </Select>
        </FormControl>
    return (
        (typeof(name) === 'undefined') ? content : <FormControlLabel control={content} label={name} labelPlacement="start" style={{marginLeft:40}}/>
    )
}

export default SelectForm
import React, {useState, useEffect}  from "react"
import Button from '@material-ui/core/Button';

import { makeStyles, withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Header = ({component}) =>
    <div style={{paddingLeft:'50px', fontSize:'20px', marginBottom:'30px'}}>
        {component}
    </div>

const useStyles = makeStyles((theme) => ({
    root : {
        display:'none'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 186,
        backgroundColor: 'white',
    },
}));

const SelectBox = ({children}) =>
    <div style={{
        width:'calc(100% - 100px)',
        padding:'20px',
        background: '#eee',
        borderRadius:'20px',
        margin:'10px auto'
    }}> 
        {children}
    </div>

const OptionBox = ({name, options}) => {
    return (
        <div style={{
            padding:'10px',
        }}>
            <div>{name}</div>
            {options.map((option, idx) => (
                <Button variant="contained" key={idx}>{option}</Button>
            ))}
        </div>
    )
}

const Toolbar = (props) => {
    const {title} = props
    const [age, setAge] = useState('')
    const handleChange = (event) =>  setAge(event.target.value)
    const classes = useStyles();
    console.log(age)
    return (
        <div style={{
            marginBottom: '30px',
            padding: '10px'
        }}>
            <Header component={title}/>
            <SelectBox>
            <FormControlLabel
                style={{
                    width : '30%'
                }}
                control={
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Campus</InputLabel>
                        <Select
                            value={age}
                            defaultValue={10}
                            onChange={handleChange}
                            label="Campus"
                            inputProps={{
                                name: 'Campus',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                }
                label="캠퍼스"
                labelPlacement="start"
            />
            <FormControlLabel
            style={{
                width : '30%'
            }}
                control={
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Way</InputLabel>
                        <Select
                            value={age}
                            defaultValue={10}
                            onChange={handleChange}
                            label="Way"
                            inputProps={{
                                name: 'Way',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                }
                label="등하교"
                labelPlacement="start"
            />
            <FormControlLabel
            style={{
                width : '30%'
            }}
                control={
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Line</InputLabel>
                        <Select
                            value={age}
                            defaultValue={10}
                            onChange={handleChange}
                            label="Line"
                            inputProps={{
                                name: 'Line',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                }
                label="노선"
                labelPlacement="start"
            />
            
            </SelectBox>
        </div>
    )
}
export default Toolbar
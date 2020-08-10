/*eslint-disable */
import React, {useState, useEffect, }  from "react"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SelectForm from './SelectForm'
import TextField from '@material-ui/core/TextField'


import '../../style/font.css'

const useStyles = makeStyles((theme) => ({
    toolbar : {
        width:'calc(100% - 10px)',
        height: '70px', padding:'5px',
        background: '#eee',
        borderRadius:'20px',
        margin:'0 auto',
        marginBottom:'30px',
    },
    head: {
        position:'relative',
        textAlign:'center',
        fontSize:'24px',
        marginBottom:'20px',
        fontFamily:'NanumSquareRoundEB',
        fontWeight: 'bold',
        height:'32px',
        color:'#2c537a',
        width:'100%',
        '&:after' : {
            content:'attr(data-text)',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '-1',
            width:'100%',
        },
    },
    button : {
        float:'right',
        fontSize:'15px',
        marginTop: '9px',
        fontWeight:'normal',
        marginLeft:'10px',
        cursor:'pointer'
    },
}));

const Header = ({component, style, button}) =>
    <div className={style} data-text={component}>{button}</div>

const SelectBox = ({children, style}) => <div className={style}> {children} </div>
const TextForm = ({label, onChange, name, value='', textType = 'text'}) => {
    const [text, setText] = useState<any>(value)
    useEffect(() => {
        setText(value)
    }, [value])

    const textField = 
        <TextField 
            id={label} 
            label={label} 
            variant="outlined" 
            value={text}
            type={textType}
            onChange={ev => {
                const val = ev.target.value
                setText(val)
                onChange(val)
            }}
            style = {{width:190, marginTop:8, marginLeft:10, backgroundColor:'#fff'}}/>
    return (
        <div style={{float : 'left'}}>
                {(typeof(name) === 'undefined') ? textField : 
                <FormControlLabel control={textField} label={name} labelPlacement="start" style={{
                    marginLeft:40
                }}/>
                }
        </div>
    )
}

const Toolbar = (props) => {
    const {header = true, title, inputForm, buttons} = props
    const classes = useStyles()
    return (
        <div style={{
            marginBottom: '30px'}}>
            {header ? <Header 
                component={title} 
                style={classes.head} 
                button = {
                    buttons.map((data, idx) => 
                        <div className={classes.button} key={idx} onClick={data['action']}>{data['label']}</div>
            )}/> : null}
            <div style={{marginBottom:'30px'}}>
            {
                inputForm.map((box, key) => 
                    <SelectBox style={classes.toolbar} key={key}>
                        {box.map((form, idx) =>  
                            ((form['type'] === 'select') ? 
                                <SelectForm {...form} key={idx}/> : 
                                <TextForm {...form} key = {idx}/>))} 
                    </SelectBox>)
            }
            </div>
        </div>
    )
}
export default Toolbar
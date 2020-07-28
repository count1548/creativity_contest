/*eslint-disable */
import React, {useState, }  from "react"
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SelectForm from './SelectForm'

import '../../style/font.css'

const useStyles = makeStyles((theme) => ({
    toolbar : {
        width:'100%',
        height: '70px', padding:'5px',
        background: '#eee',
        borderRadius:'20px',
        margin:'0 auto',
        marginBottom:'60px',
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
    }
}));

const Header = ({component, style, button}) =>
    <div className={style} data-text={component}>{button}</div>

const SelectBox = ({children, style}) => <div className={style}> {children} </div>

const Toolbar = (props) => {
    const {title, selectForm, buttons} = props
    const classes = useStyles()
    return (
        <div style={{
            marginBottom: '30px',
            padding: '10px'
        }}>
            <Header 
                component={title} 
                style={classes.head} 
                button = {
                    buttons.map((data, idx) => 
                        <div className={classes.button} key={idx} onClick={data['action']}>{data['label']}</div>
                    ) } />
            <SelectBox style={classes.toolbar}>
                {selectForm.map((form, idx) =>  <SelectForm {...form} key={idx}/>)} 
            </SelectBox>
        </div>
    )
}
export default Toolbar
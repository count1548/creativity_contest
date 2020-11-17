/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { equip_data, check_log } from '../../dataset'

const useStyles = makeStyles((theme) => ({
    tableRow : {
        display:'table-row'
    }, button : { position:'relative', bottom:'-3px'},
    tableCell : {
        '&:nth-of-type(1)' : {
            fontWeight:'bold',
            color:'#A12422'
        },
        display:'table-cell',
    }
}));
const TextLabel = props => {
    const {label, children, button=null, buttonEvent = null} = props
    const classes = useStyles()
    return (
    <div className={classes.tableRow}>
        <div className={classes.tableCell}>{label}</div>
        <div className={classes.tableCell}>{children}</div>
        {button ? <div className={classes.tableCell + ' ' + classes.button} onClick={buttonEvent}>{button}</div> : null}
    </div>)
}

export default TextLabel;

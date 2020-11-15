/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { equip_data, check_log } from '../../dataset'

const useStyles = makeStyles((theme) => ({
    tableRow : {
        display:'table-row',
    },
    tableCell : {
        display:'table-cell',
        padding:'0px'
    }
}));
const TextLabel = props => {
    const {label, children, button=null} = props
    const classes = useStyles()
    return (
    <div className={classes.tableRow}>
        <div className={classes.tableCell}>{label}</div>
        <div className={classes.tableCell}>{children}</div>
        {button ? <div className={classes.tableCell}>{button}</div> : null}
    </div>)
}

export default TextLabel;

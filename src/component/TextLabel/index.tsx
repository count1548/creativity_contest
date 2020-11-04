/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { equip_data, check_log } from '../../dataset'

const useStyles = makeStyles((theme) => ({
}));
const TextLabel = props => {
    const {label, children} = props
    return (
    <div>
        {label} : {children}
    </div>)
}

export default TextLabel;

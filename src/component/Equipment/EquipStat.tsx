/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CheckLog from '../../routes/CheckLog'
import TextLabel from '../TextLabel'
import Loading from '@material-ui/core/CircularProgress';
import { getAPI, isAvailable } from "../../data_function"

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'100%',
        minHeight:'300px',
        background:'grey',
        padding: '10px',
    },
}));

let check_log:any[]
const EquipStat = props => {
    const { title, image, EquipInfo } = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(0);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
    return (
    <div className={classes.container}>
        
    </div>) //등록하기를 새로운 다이어로그로 띄우기
}

export default EquipStat;

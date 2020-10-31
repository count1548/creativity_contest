/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { equip_data, check_log } from '../../dataset'
import CheckLog from './CheckLog'

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        minWidth:'800px',
        border:'1px solid gray'
    },
    infoContainer: {
        position : 'relative',
        float:'left',
        width:'30%',
        marginTop:'20px',
        padding:'30px',
        border:'1px solid gray'
    },
    imageBox: {
        width:'100%',
        padding : '10px',
        background : '#eee',
    },
    infoBox: {
        width:'100%',
        marginTop : '30px',
        padding : '10px',
        border:'1px solid gray'
    },
    header : {

    },
    title : {
        marginLeft:'20px'
    },
    controlBox: {
        float:'right',
        left:'0',
    },
    logBox : {

    }
}));
const EquipInfo = props => {
    const { stat, title, image, EquipInfo } = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(0);

    return <div className={classes.container}>
        <div className={classes.header}>
            <span className={classes.title}>{title}</span>
            <div className={classes.controlBox}>
                <Button>생성하기</Button>
            </div>
        </div>
        <div className={classes.infoContainer}>
            <img className={classes.imageBox} src={image} />
            <div className={classes.infoBox}>

            </div>
        </div>
        <div className={classes.logBox}><CheckLog size={5}/></div>
    </div>
}

export default EquipInfo;

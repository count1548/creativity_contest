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
        width:'calc(100% - 20px)',
        minHeight:'300px',
        background:'#eee',
        margin: '10px', padding: '10px'
    },
    guideBox : {
        height : 'calc(100% - 10px)',
        padding : '5px', margin: '5px',
        border:'1px solid gray', float:'left'
    },
    circle : {
        width : '20px', height : '20px', borderRadius:'50%'
    }
}));

const GuideBox = props => {
    const {title, children, classname=''} = props
    return (
        <div className={classname}>
            <div style={{width : '100%', textAlign:'center'}}>{title}</div>
            {children}
        </div>
    )
}


let check_log:any[]
const EquipStat = props => {
    const { title, image, EquipInfo } = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(0);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
    return (
    <div className={classes.container}>
        <GuideBox title={'점검목록'} classname={classes.guideBox}>
            <table>
                <tr>
                <td><div className={classes.circle} style={{background:'green'}}></div></td><td>점검완료</td>
                </tr>
                <tr>
                <td><div className={classes.circle} style={{background:'red'}}></div></td><td>미전검</td>
                </tr>
            </table>
        </GuideBox>
        <GuideBox title={'점검기록'} classname={classes.guideBox}>

        </GuideBox>
    </div>) //등록하기를 새로운 다이어로그로 띄우기
}

export default EquipStat;

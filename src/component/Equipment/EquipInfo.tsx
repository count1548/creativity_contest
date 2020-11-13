/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CheckLog from '../../routes/CheckLog'
import TextLabel from '../TextLabel'
import Loading from '@material-ui/core/CircularProgress';
import { getAPI, isAvailable } from "../../data_function"
import Tooltip from '../Tooltip'
import InnerMap from '../Tooltip/InnerMap'

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'100%',
    },
    infoContainer: {
        float:'left',
        width:'40%',
    },
    imageBox: {
        width:'calc(100% - 20px)',
        height:'320px',
        padding : '10px',
        background : '#eee',
    },
    infoBox: {
        width:'calc(100% - 20px)', height:'105px',
        marginTop : '10px',
        padding : '10px',
        border:'1px solid gray'
    },
    header : { },
    title : {
        marginLeft:'20px'
    },
    controlBox: {
        float:'right',
        left:'0',
    },
    logBox : {
        float:'right',
        width:'58%',
    }
}));

let check_log:any[]
const EquipInfo = props => {
    const { title, image, EquipInfo } = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(0);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
  
    useEffect(() => {
        setState('apply')
        getAPI(`/check_log/id`, 'result', 3001, EquipInfo['ID']).then(res => {
            check_log = res
            setState('show')
        })
    }, [updated, EquipInfo['ID']])
    if (stat === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>

    return (
    <div className={classes.container}>
        <div className={classes.header}>
            <span className={classes.title}>{title}</span>
            <div className={classes.controlBox}>
                <Button>생성하기</Button>
            </div>
        </div>
        <div className={classes.container} style={{
                width : 'calc(100% - 20px)',
                padding : '10px',
                marginTop:'20px'
            }}>
            <div className={classes.infoContainer}>
                <Tooltip content={<InnerMap/>}>
                    <img className={classes.imageBox} src={image} />
                </Tooltip>
                <div className={classes.infoBox}>
                    <TextLabel label={'제조번호'}>{EquipInfo['serial']}</TextLabel>
                    <TextLabel label={'위치'}>{EquipInfo['location']}</TextLabel>
                    <TextLabel label={'점검여부'}>{EquipInfo['check']}</TextLabel>
                </div>
            </div>
            <div className={classes.logBox}>
                <CheckLog size={8}
                    id = {selected}
                    filtering = {false}
                    search = {false}
                    paging = {false}
                    title = {false}
                    data = {check_log}
                /></div>
        </div>
    </div>) //등록하기를 새로운 다이어로그로 띄우기
}

export default EquipInfo;

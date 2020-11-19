/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CheckLog from '../../routes/CheckLog'
import TextLabel from '../TextLabel'
import Loading from '@material-ui/core/CircularProgress'
import { getAPI, isAvailable, getAPI_local } from "../../data_function"
import Tooltip from '../Tooltip'
import InnerMap from '../Map/InnerMap'
import QRImage from './QRImage'
import EquipStat from './EquipStat'

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
        display:'table',
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
    },
    guideTr : {
        '& td' : {
            padding : '5px',
        },
    },
}));

let check_log:any[] = []
const base_img : string = './imgs/equipment.png'
null
const EquipInfo = props => {
    const { title, EquipInfo, buttonList = [], map_data, InnerState = null, limit = 8 } = props
    const classes = useStyles()
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
  
    if(typeof EquipInfo === 'undefined') return <div></div>
    useEffect(() => {
        setState('apply')
        getAPI(`/equip/check?Eq_id=${EquipInfo['id']}`).then(res => {
            check_log = res
            setState('show')
        })
    }, [EquipInfo['id']])
    if (stat === 'apply') return <div style={{ width: '300px', height:'490px', margin: '30px auto' }}><Loading size={200} /></div>
    
    const map = map_data.find(data => data['id'] == EquipInfo['map']) 
    
    return (
    <div className={classes.container}>
        <div className={classes.header}>
            <span className={classes.title}>{title}</span>
            <div className={classes.controlBox}>
                {buttonList.map((value, idx) => 
                <Button key={idx} onClick={value['func']}>{value['label']}</Button>)}
            </div>
        </div>
        <div className={classes.container} style={{
                width : 'calc(100% - 20px)',
                padding : '10px',
                marginTop:'20px'
            }}>
            <div className={classes.infoContainer}>
                <Tooltip content={
                    <InnerMap 
                        image={typeof map !== 'undefined' ? map['image'] : null} 
                        Mark={EquipInfo['location']}
                        wdt={300} hgt={150}
                        allowClick={false}
                        />
                }><img className={classes.imageBox} src={`./imgs/${EquipInfo['image']}`} onError={(e:any) => {
                    e.target.onerror=null
                    e.target.src = base_img
                }}/></Tooltip>
                <div className={classes.infoBox}>
                    <TextLabel 
                        label={'제조번호'} 
                        button={<img src='./imgs/qrimg.png' width={20} height={20}/>}
                        buttonEvent={() => setState('qrview')}
                    >{EquipInfo['serial']}</TextLabel>
                    <TextLabel label={'위치'}>{EquipInfo['boarding_location']}</TextLabel>
                    <TextLabel label={'점검여부'}>{EquipInfo['check'] ? "점검" : "미점검"}</TextLabel>
                </div>
            </div>
            <div className={classes.logBox}>
                <CheckLog size={limit}
                    id = {EquipInfo['id']}
                    filtering = {false}
                    search = {false}
                    paging = {false}
                    title = {false}
                    data = {check_log}
                    hiddenNumber = {true}
                />
                {InnerState === null ? null : InnerState}
            </div>
        </div>
    <QRImage 
        open={stat === 'qrview'}
        image = {EquipInfo['QRImg']}
        onClose = {()=>setState('show')}
    />
    </div>) //등록하기를 새로운 다이어로그로 띄우기
}

export default EquipInfo;

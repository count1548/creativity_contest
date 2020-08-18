/*eslint-disable */
import React, {useState, useEffect}  from "react"
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI} from '../data_function' 
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
// import GoogleMapReact from 'google-map-react'
import GoogleMap from '../component/Map'
import '../style/font.css'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

async function getData() {
    const stop = await getAPI('bus/shuttle/stop/', 'result')
    if(!isAvailable(stop)) return []

    return stop
}

let stopData:any[] = []
interface stopInterface {
    IDX?:number,
    KOR_NAME : string, EN_NAME : string, DETAIL? : string,
}

const defaultValue:stopInterface = {
    KOR_NAME : '', EN_NAME : '', DETAIL : '',
}

let stopInfo:stopInterface = {...defaultValue} as any

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table : {
        width : '30%',
        float : 'left'
    },
    configBox : {
        width : 'calc(70% - 10px)',
        paddingLeft:'10px',
        float: 'right' as const
    },
    button : {
        display:'block',
        padding : '10',
        margin : '10px auto'
    },
    mainContent : {
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both'
        }
    }
  }),
)

let defaultLocation = {
    lat: 36.734944,
    lng: 127.07475
}

const StopList = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [selected, setSelected] = useState('')
    const [location, setLocation] = useState({lat: 0, lng: 0 })

    const [zoom, setZoom] = useState(11)
    const classes = useStyles()
    const init = () => {
        stopInfo = {...defaultValue}
        setLocation({lat:0, lng:0})
        setSelected('')
    }

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            stopData = res
            setState('show')
        })
    }, [updated])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const rows = stopData.map(value => [value['KOR_NAME']])
    const AnyReactComponent = ({ lat, lng, text }) => <div>{text}</div>;

    const form = [
        [   //Basic Information
            {
                label : '이름',
                type : 'text',
                onChange : value => {stopInfo['KOR_NAME'] = value} ,
                value : stopInfo['KOR_NAME'],
            },
            {
                label : '영어이름',
                type : 'text',
                onChange : value => {stopInfo['EN_NAME'] = value} ,
                value : stopInfo['EN_NAME'],
            },
        ],[
            {
                label : '추가정보',
                type : 'text',
                onChange: value => { stopInfo['DETAIL'] = value },
                value : stopInfo['DETAIL'] === null ? '' : stopInfo['DETAIL']
            },
        ], [   //Location
            {
                label : '위도',
                type : 'text',
                textType : 'number',
                onChange: value => {
                    setLocation({...location, lat:value})
                 },
                value : location.lat
            },
            {
                label : '경도',
                type : 'text',
                textType : 'number',
                onChange: value => {
                    setLocation({...location, lng:value})
                 },
                value : location.lng
            },
        ],
    ]
    const buttonClick = () => {
        const url = (selected === '') ? 'create' : 'update'
        
        setState('apply')
        setAPI(`/bus/shuttle/stop/${url}`, {...stopInfo, 
            LATITUDE : location.lat,
            LONGITUDE : location.lng, })
            .then(res => { init(); setUpdated(!updated) })
    }
    const rowClick = (idx) => {
        if(selected === idx) {init(); return}
        const {LATITUDE, LONGITUDE, ...mainInfo} = stopData[idx]
        stopInfo = {...mainInfo}
        defaultLocation = {
            lat : LATITUDE, 
            lng : LONGITUDE
        }
        setSelected(idx)
        setLocation({
            lat : LATITUDE,
            lng : LONGITUDE
        })
    }
    return (
        <div className='main-warp'>
            <div className={classes.mainContent}>
                <div className={classes.table}>
                    <Table
                        column = {['정류장']}
                        isrowHead={false}
                        record = {rows}
                        headWidth={50}
                        onClick={rowClick}
                        maxHeight={735}
                        selectable={true}
                        selecteCount={1}
                        style={{
                            selectedRowCell : {
                                backgroundColor:'#777'
                            }
                        }}
                    />
                </div>
                
                <div className={classes.configBox}>
                    <Toolbar
                        header={false}
                        inputForm={form} 
                    ></Toolbar>
                    <GoogleMap 
                        onChange = {(location) => {
                            setLocation(location)
                        }}
                        defaultCenter={defaultLocation}
                    />
                </div>
            </div>
            <Button 
                variant="contained" 
                color='primary' 
                onClick={buttonClick}
                className={classes.button}>submit</Button>
        </div>
    )
}
export default StopList
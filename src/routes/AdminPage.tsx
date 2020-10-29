/*eslint-disable */
import React, {useState, useEffect}  from "react"
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI} from '../data_function' 
import Toolbar from '../component/Toolbar'
import Table from '../component/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import Dialog from '../component/Dialog'
import GoogleMap from '../component/Map'
import '../style/font.css'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

async function getData() {
    const stop = await getAPI('bus/stop/', 'BUS_STOP')
    if(!isAvailable(stop)) return []

    return stop
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

  }),
)

let defaultLocation = {
    lat: 36.734944,
    lng: 127.07475
}

const StopList = props => {
    const [updated, setUpdated] = useState(true)
    const [stat, setState] = useState('apply')
    const [selected, setSelected] = useState<number|null>(null)
    const [location, setLocation] = useState({lat: 0, lng: 0 })
    const [way, setWay] = useState('')
    const [required, setRequired] = useState(false)

    const [zoom, setZoom] = useState(11)
    const classes = useStyles()
    const init = () => {}

    //setting table head data
    useEffect(()=> {
        getData().then(res => {
            setState('show')
        })
    }, [updated])
    if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

    const form = [
    ]
    const buttonClick = () => {}
    const rowClick = idx => { }

    return (
        <div className='main-warp'>
            {/* <Dialog
                children={'필수 항목을 입력하십시오'}
                onClose = {()=>setRequired(false)}
                defaultState={required}
            />
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
                className={classes.button}>submit</Button> */}
        </div>
    )
}
export default StopList
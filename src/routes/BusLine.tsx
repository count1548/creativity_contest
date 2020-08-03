/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '../component/Modal/Modal'
import {getAPI} from '../data_function'
import { DropzoneDialog } from 'material-ui-dropzone';
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import '../style/font.css'
import '../style/lineTable.css'

const useStyles = makeStyles(theme => createStyles({
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}));


const Dropzone = ({open, onClose, onSave}) => {
  const classes = useStyles();
  return (
    <DropzoneDialog
    acceptedFiles={["image/*", "video/*", "application/*"]}
    cancelButtonText={"cancel"}
    submitButtonText={"submit"}
    maxFileSize={5000000}
    open={open}
    onClose={onClose}
    onSave={files => onSave(files)}
    showPreviews={false}
    showFileNamesInPreview={true}
  />
    )
}

interface rowInterface {
  'LINE' : any, 
  'DATA' : any[]
}
const lineToRows = (dict:any[], stop) : rowInterface[] => {
  let ros:rowInterface[] = [], obj = {}
  const data = Data.dictToArr(dict, 'BUS_LINE_ID', null, true)
  for(var key in data) {
    data[key].sort((a, b) => (a['LINE_SEQUENCE'] < b['LINE_SEQUENCE'] ? -1 : 1))
    const stop_data:any[] = data[key].map(value => ({
      stopID: value['BUS_STOP_ID'],
      stopName : stop[value['BUS_STOP_ID']],
      timeID : value['IDX_BUS_LINE']
    }))
    ros.push({
      'LINE': key,
      'DATA' : stop_data
    })
  }
  return ros
}

const setTime_orderby_ID = (dict:any[]) =>  {
  return Data.dictToArr(dict, 'IDX_BUS_LINE', 'BUS_TIME', true)
}

const columns = ['노선', '월', '화', '수', '목', '금']
const week = 5

async function getData() {
  const stop = await Data.getAPI('bus/stop/', 'BUS_STOP')
  const time = await Data.getAPI('bus/time/', 'TIME_TABLE')
  const line = await Data.getAPI('bus/line/', 'BUS_LINE')

  const stopName = Data.dictToArr(stop, 'BUS_STOP_ID', 'BUS_STOP_NAME')
  const timeData = setTime_orderby_ID(time)
  const rows = lineToRows(line, stopName)

  return {stopName, timeData, rows}
}

let stopName:Object = {}, rows:any[] = [], timeData = {}

const BusLine = props => {
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)

  const [campus, setCampus] = useState('') 
  const [way, setWay] = useState('')
  const [lineIDX, setlineIDX] = useState<any | null>('')

  const init = () => {
    setCampus('')
    setWay('')
    setlineIDX('')
  }

  //setting table head data
  useEffect(()=> {
    //update 대기
      getData().then(res => {
        ({stopName, timeData, rows} = res)
        setState('show')
      })
  }, [updated])

  if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

  const selected = (lineIDX !== '')
  const stoplist = Data.findFittedList(rows, campus, way)

  const transferData = (stop, day, value) => {
    const key = rows[lineIDX]['DATA'].forEach((data, idx) => {
      if(idx === stop) return data['timeID']
    })

    return {
      'IDX_BUS_LINE' : key,
      'DAY' : day,
      'VALUE' : value
    }
  }

  const equals = (obj1, obj2) => {
    if((obj1['IDX_BUS_LINE'] === obj2['IDX_BUS_LINE']) &&
    (obj1['DAY'] == obj2['DAY'])) return true
    return false
  }
  const createButtonForm = (label, to) => ({label : label, action : () => setState(to)})
  const buttons = {
    'return' : createButtonForm('돌아가기', 'show'),

    'update' : createButtonForm('수정하기', 'update'),
    'mod-line' : createButtonForm('노선수정', 'update-line'),
    'mod-time' : createButtonForm('시간수정', 'update-time'),

    'create' : createButtonForm('생성하기', 'create'),

    'delete' : createButtonForm('삭제하기', 'delete'),
    'upload' : createButtonForm('불러오기', 'upload')
  }

  const getButtonList = stat => {
    let bntlist:Object[] = [buttons['return']]

    switch(stat) {
      case 'show':
        bntlist = [buttons['create'], buttons['upload']]
        if(selected) {
          bntlist = bntlist.concat([buttons['update'], buttons['delete']])
        }
        break
      case 'update':
        if(selected) bntlist = [buttons['mod-line'], buttons['mod-time']]
        break
    }

    return bntlist
  }
  
  

  const forms = [
    {
        name : '캠퍼스',
        label : 'Campus',
        options : [
            {value : '아산캠퍼스', label : '아산캠퍼스'},
            {value : '천안캠퍼스', label : '천안캠퍼스'},
            {value : '당진캠퍼스', label : '당진캠퍼스'}
        ],
        action : value => setCampus(value),
        value : campus,
        disable : () => (stat !== 'show')
    },
    {
        name : '등하교',
        label : 'Way',
        options : [
            {value : 0, label : '등교'},
            {value : 1, label : '하교'},
        ],
        action : value => setWay(value),
        value : way,
        disable : () => (stat !== 'show')
    },
    {
        name : '노선',
        label : 'Line',
        options : (stoplist == null) ? 
          [] : stoplist.map(value => ({value : value['IDX'], label : value['NAME']})),
        action : value => setlineIDX(value),
        value : lineIDX,
        disable : () => ((stoplist == null) || stat !== 'show')
    },
  ]

  const changeList:Object[] = []

  const displayComponent = () => {
    if(stat === 'create') {
      return (
        <TransferList
          data = {stopName}
          chData = {[]}
          allData = {Object.keys(stopName).map((value:any) => value*1)}
          title = {'노선'}
          onSubmit = {data=>{
            setState('apply')
            Data.setAPI('/bus/line/create', { 'data' : data }).then(res => setUpdated(!updated))
          } }
        />
      )
    }
    if (!selected) return <NoData message='Please Select Options'/>
    let props:Object = {}

    const record = rows[lineIDX]['DATA'].map(data => {
      if(typeof(timeData[data['timeID']]) !== 'undefined')
        return timeData[data['timeID']].map( time => time.split(':').slice(0, 2).join(':') )
    })
    
    switch(stat) {
      case 'update-line':
        return (
          <TransferList
            data = {stopName}
            chData = {rows[lineIDX]['DATA'].map(value => value['stopID'])}
            allData = {Object.keys(stopName).map((value:any) => value*1)}
            title = {'노선'}
            onSubmit = {data=>{
              setState('apply')
              Data.setAPI('/bus/line/update', {
                'lineIDX' : rows[lineIDX]['LINE'], 'data' : data}).then(res => setUpdated(!updated))
            }}
          />)
      case 'update-time':
        props = {
          'onChange' : (stop, day, value) => {
            const tdata = transferData(stop, day, value)
            let flag = true
            changeList.forEach((data, idx) => {
              if(equals(data, tdata)) {
                changeList[idx] = tdata
                flag = false
              }
            })
            if(flag) changeList.push(tdata)
          },
          'onSubmit' : ()=> {
            setState('apply')
            Data.setAPI(
              '/bus/time/update', 
              {timeList : changeList}).then(res => setUpdated(!updated))
          }
        }
        break
    }
    return (
      <Table
        columnHead = {columns}
        rowHead = {rows[lineIDX]['DATA'].map(data => (data['stopName']))}
        record = {record}
        stat={stat}
        headWidth={20}
        {...props}
    />)
  }
  const displayModal = () => {
    var open = false

    var component:any = null

    switch(stat) {
      case 'delete':
        if(!selected) return null
        open = (stat === 'delete')
        component = <div style={{ textAlign:'center' }}>
          노선을 삭제하시겠습니까?<br/><br/><br/>
          <Button  variant="contained" color="secondary" onClick = {() => {
            setState('apply')
            Data.setAPI('/bus//shuttle/line/delete', {
              'lineID' : rows[lineIDX]['LINE'],
            }).then(res => setUpdated(!updated))
            init()
          }}>Delete</Button>
        </div>
        break
      case 'upload' :
        open = (stat === 'upload')
        return <Dropzone
          open = {open}
          onClose = {()=>setState('show')}
          onSave = {files=>{
            setState('apply')
            Data.setTimeTable(files, 'bus').then(res => {
              console.log(files, typeof(files[0]))
              setUpdated(!updated)
            }).catch(err => console.log(err))
          }}/>        
    }
    return (
      <Modal close = {()=>setState('show')} visible = {open}>
        {component}
      </Modal>
    )
  }
  return (
    <div>
      <Toolbar 
      title = '통학버스 시간표' 
      selectForm = {forms}
      type='selectBox'
      buttons={getButtonList(stat)}/>
      {displayComponent()}
      {displayModal()}
    </div>
  )
}

export default BusLine;

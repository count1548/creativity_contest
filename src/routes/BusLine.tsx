/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '../component/Modal/Modal'
import {getAPI} from '../data_function'
import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'

import '../style/font.css'

interface rowInterface {
  'LINE' : any, 
  'DATA' : any[]
}
const lineToRows = (dict:any[], stop) : rowInterface[] => {
  let ros:rowInterface[] = [], obj = {}
  const data = Data.dictToArr(dict, 'BUS_LINE_ID', null, true)
  for(var key in data) {
    data[key].sort((a, b) => 
      (a['LINE_SEQUENCE'] < b['LINE_SEQUENCE'] ? -1 : 1))
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

const BusLine = props => {
  const [stat, setState] = useState('show')

  const [stop, setStop] = useState<any | null>(null)
  const [line, setLine] = useState<any | null>(null)
  const [time, setTime] = useState<any | null>(null)
  
  const [campus, setCampus] = useState('') 
  const [way, setWay] = useState('')
  const [lineIDX, setlineIDX] = useState<any | null>('')
  

  const init = () => {
    setCampus('')
    setWay('')
    setlineIDX('')
  }

  let stopName:Object = {}, rows:any[] = [], timeData = {}

  //setting table head data
  useEffect(()=> {
    Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
    Data.getAPI('bus/line/', 'BUS_LINE', setLine)
    Data.getAPI('bus/time/', 'TIME_TABLE', setTime)
  }, [stat])
  if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

  //after data setting 데이터 가공
  if(stop != null) stopName = Data.dictToArr(stop, 'BUS_STOP_ID', 'BUS_STOP_NAME')
  if(stopName != null && line != null) rows = lineToRows(line, stopName)
  if(time != null) timeData = setTime_orderby_ID(time)
  const selected = (lineIDX !== '')
  const stoplist = Data.findFittedList(rows, campus, way)

  const transferData = (stop, day, value) => {
    var key = -1
    rows[lineIDX]['DATA'].forEach((data, idx) => {
      if(idx === stop) { key = data['timeID'] }
    })
    if(key === -1) return {}

    const object = {
      'IDX_BUS_LINE' : key,
      'DAY' : day,
      'VALUE' : value
    }

    return object
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
  }

  const getButtonList = stat => {
    let bntlist:Object[] = [buttons['return']]

    switch(stat) {
      case 'show':
        bntlist = [buttons['create']]
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
            Data.setAPI('/bus/line/update', { 'data' : data }, setState, 'show')
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
                'lineIDX' : rows[lineIDX]['LINE'], 'data' : data
              }, setState, 'show')
            } }
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
              {timeList : changeList}
              , setState, 'show')
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
    if(!selected) return null
    var open = false

    var component:any = null

    switch(stat) {
      case 'delete':
        open = (stat === 'delete')
        component = <div style={{ textAlign:'center' }}>
          노선을 삭제하시겠습니까?<br/><br/><br/>
          <Button  variant="contained" color="secondary" onClick = {() => {
            setState('apply')
            Data.setAPI('/bus//shuttle/line/delete', {
              'lineID' : rows[lineIDX]['LINE'],
            }, setState, 'show')
            init()
          }}>Delete</Button>
        </div>
        
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

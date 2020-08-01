/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import {getAPI} from '../data_function'
import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress'
import Modal from '../component/Modal/Modal'
import Button from '@material-ui/core/Button';

import '../style/font.css'

const lineToRows = (dict:any, stop, lineIDX) => {
  const IDX = Data.dictToArr(lineIDX, 'IDX', 'SHUTTLE_STOP_ID')
  for(var line in dict) for(var day in dict[line]) for(var bus in dict[line][day])  {
    const now = dict[line][day][bus]
    
    dict[line][day]['LINE'] = now.map(value => ({
      'IDX' : IDX[value['IDX_BUS_LINE']], 
      'NAME' : stop[IDX[value['IDX_BUS_LINE']]]
    }))
    
    dict[line][day][bus] = now.map((value, idx) => ({
      'IDX_BUS_LINE' : value['IDX_BUS_LINE'],
      'TIME' : value['BUS_TIME'],
    }))
  }
  return dict
}

const setTime_orderby_ID = (dict:any[]) =>  {
  //return Data.dictToArr(dict, 'IDX_BUS_LINE', 'BUS_TIME', true)
  const data = Data.dictToArr_s(dict, 'LINE_NAME', 'CODE', null, true)
  for(var line_name in data) for(var code_name in data[line_name]) {
    data[line_name][code_name] = Data.dictToArr(data[line_name][code_name], 'BUS_ID', null, true)
  }
  return data
}

const isEmpty = obj => {
  obj.map(data => {if(Object.keys(data).length === 0 ) return true})
  return false
}

const ShuttleLine = props => {
  const [stat, setState] = useState('show')

  const [stop, setStop] = useState<any | null>(null)
  const [line, setLine] = useState<any | null>(null)
  const [time, setTime] = useState<any | null>(null) // important api sql 구문에서 첫 노선 시간에 따른 정렬 순서대로 불러올것!
  const lang = 'KOR_NAME'
  
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')
  const init = () => {
    setLineName('')
    setDay('')
  }
  const [delval, setValue] = useState('1 :  ')

  let stopName:Object = {}, 
      rows:Object = {}, 
      timeData:Object = {},
      columns:string[] = []

  //data setting
  useEffect(()=> {
    Data.getAPI('bus/shuttle/stop', 'result', setStop)
    Data.getAPI('bus/shuttle/line/', 'result', setLine)
    Data.getAPI('bus/shuttle/time/', 'result', setTime)
  }, [stat])
  
  if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>

  //after data setting 데이터 가공
  if(stop != null) stopName = Data.dictToArr(stop, 'SHUTTLE_STOP_ID', lang)
  if(time != null) timeData = setTime_orderby_ID(time)
  if(!(isEmpty([stopName, timeData]) || line === null))
    rows = lineToRows(timeData, stopName, line)
  if(!(lineName === '' || day === '') && stat !== 'create-line') {
    if(typeof(rows[lineName]) === 'undefined' || typeof(rows[lineName][day]) === 'undefined') init() 
    else columns = ['운행', ...rows[lineName][day]['LINE'].map(value => value['NAME'])]
  }

  //setting table head data
  const selected = (columns.length !== 0)
  const forms = [
    {
        name : '노선',
        label : 'Line',
        options : Object.keys(rows).map((value, idx) => ({'value' : value, 'label' : value})),
        action : value => {
          setDay('')
          setLineName(value)
        },
        value : lineName, width : 45,
        disable : () => (stat !== 'show')
    },
    {
        name : '날짜',
        label : 'Days',
        options : 
          (typeof(rows[lineName]) == 'undefined') ? ['None'] : 
            Object.keys(rows[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
        action : value => setDay(value),
        value : day, width : 45,
        disable : () => ((lineName == '') || (stat !== 'show'))
    },
  ]

  const createButtonForm = (label, to) => ({label : label, action : () => setState(to)})
  const buttons = {
    'return' : createButtonForm('돌아가기', 'show'),

    'update' : createButtonForm('수정하기', 'update'),
    'mod-line' : createButtonForm('노선수정', 'update-line'),
    'mod-time' : createButtonForm('시간수정', 'update-time'),

    'create' : createButtonForm('생성하기', 'create'),
    'new-line' : createButtonForm('노선생성', 'create-line'),
    'new-bus' : createButtonForm('배차생성', 'create-bus'),

    'delete' : createButtonForm('삭제하기', 'delete'),
    'del-line' : createButtonForm('노선삭제', 'delete-line'),
    'del-bus' : createButtonForm('배차삭제', 'delete-bus')
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
      case 'create':
        bntlist = [buttons['new-line']]
        if(selected) bntlist.push(buttons['new-bus'])
        break
      case 'delete':
        if(selected) bntlist = [buttons['del-line'], buttons['del-bus']]
        break
    }

    return bntlist
  }
  const changeList:Object[] = []
  const IdxToID = (busidx) => {
    var bus:any = -1
    const now = rows[lineName][day]

    return Object.keys(now).forEach((busID, idx) => { if(busidx === idx) return busID })
  }
  const transferData = (busIdx, stop, value) => {
    var idx = rows[lineName][day]['LINE'][stop]['IDX']    

    return {
      'IDX_BUS_LINE' : idx,
      'BUS_ID' : IdxToID(busIdx),
      'VALUE' : value
    }
  }

  const equals = (obj1, obj2) => {
    if((obj1['IDX_BUS_LINE'] === obj2['IDX_BUS_LINE']) &&
    (obj1['BUS_ID'] == obj2['BUS_ID'])) return true
    return false
  }

  const displayComponent = () => {
    if (!selected) {
      if(stat === 'create-line') {
          return <TransferList
          data = {stopName}
          chData = {[]}
          allData = {Object.keys(stopName).map((value:any) => value*1)}
          title = {'노선'}
          onSubmit = {data=>{
            setState('apply')
            Data.setAPI('/bus/shuttle/line/update', {
              'lineName' : lineName,
              'code' : day,
              'data' : data,
            }, setState, 'show')
          }}/>
      }
      return <NoData message='Please Select Options'/>
    }
    const now = rows[lineName][day]
    const props:Object = {}
    let deleteForm:any = null

    const record = Object.keys(now).map(key => {
      if(key !== 'LINE')
        return now[key].map(data => data['TIME'].split(':').slice(0, 2).join(':'))
    })
    record.pop()
    const rowHead = Array.from({length : Object.keys(now).length-1}, (x, idx) => idx+1)

    switch(stat) {
      case 'update-line':
        return <TransferList
            data = {stopName}
            chData = {now['LINE'].map(value => value['IDX'])}
            allData = {Object.keys(stopName).map((value:any) => value*1)}
            title = {'노선'}
            onSubmit = {data=>{
              setState('apply')
              Data.setAPI('/bus/shuttle/line/update', {
                'lineName' : lineName,
                'code' : day,
                'data' : data,
              }, setState, 'show')
            } }/>
      case 'update-time' :
        props['onChange'] = (bus, stop, value) => {
          const tdata = transferData(bus, stop, value)
              let flag = true
              changeList.forEach((data, idx) => {
                if(equals(data, tdata)) {
                  changeList[idx] = tdata
                  flag = false
                }
              })
              if(flag) changeList.push(tdata)
        }
        props['onSubmit'] = () => {
          setState('apply')
          Data.setAPI(
            '/bus/shuttle/time/update', 
            {timeList : changeList}
            , setState, 'show')
        }
        break
      case 'delete-bus' :
        props['onSubmit'] = list => {
          setState('apply')
          Data.setAPI(
            '/bus/shuttle/bus/delete', 
            {delList : list.map(idx => IdxToID(idx))}
            , setState, 'show')
        }
        break
    }

   return <Table
          columnHead = {columns}
          rowHead = {rowHead}
          record = {record}
          stat={stat}
          headWidth={5}
          {...props}
          />
  }
  const displayModal = () => {
    if(!selected) return null
    const newBus = new Array(columns.length-1)
    var open = false

    var component:any = null

    switch(stat) {
      case 'create-bus':
        open = (stat === 'create-bus')

        component = <Table
          columnHead = {columns}
          rowHead = {['BUS']}
          record = {[newBus]}
          stat={'update-time'}
          headWidth={5}
          onChange={(bus, stop, value) => newBus[stop] = value }
          onSubmit = { ()=> {
            setState('apply')
            Data.setAPI( '/bus/shuttle/time/create', 
            {
              lineName : lineName,
              day : day,
              timeList : rows[lineName][day]['LINE'].map((value, idx) => ({
                'IDX_BUS_LINE': value['IDX'],
                'VALUE' : newBus[idx]
            }))}
            ,setState, 'show')            
          }}
      />
      break
      case 'delete-line':
        open = (stat === 'delete-line')
        component = <div style={{ textAlign:'center' }}>
          노선을 삭제하시겠습니까?<br/><br/><br/>
          <Button  variant="contained" color="secondary" onClick = {() => {
            setState('apply')
            Data.setAPI('/bus//shuttle/line/delete', {
              'lineName' : lineName,
              'code' : day,
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
      title = '셔틀버스 시간표' 
      selectForm = {forms}
      type={(stat === 'create-line') ? 'textField' : 'selectBox'}
      buttons={getButtonList(stat)}/>
      {displayComponent()}
      {displayModal()}
    </div>
  )
}

export default ShuttleLine;

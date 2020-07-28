/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {getAPI} from '../data_function'
import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/Table'
import NoData from '../component/Table/NoData'

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
  const [time, setTime] = useState<any | null>(null)
  const lang = 'KOR_NAME'
  
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')

  let stopName:Object = {}, 
      rows:Object = {}, 
      timeData:Object = {},
      columns:Object = {}

  //data setting
  useEffect(()=> {
    Data.getAPI('bus/shuttle/stop', 'result', setStop)
    Data.getAPI('bus/shuttle/line/', 'result', setLine)
    Data.getAPI('bus/shuttle/time/', 'result', setTime)
  }, [])
  
  //after data setting 데이터 가공
  if(stop != null) stopName = Data.dictToArr(stop, 'SHUTTLE_STOP_ID', lang)
  if(time != null) timeData = setTime_orderby_ID(time)
  if(!(isEmpty([stopName, timeData]) || line === null))
    rows = lineToRows(timeData, stopName, line)
  if(!(lineName === '' || day === ''))
    columns = ['운행', ...rows[lineName][day]['LINE'].map(value => value['NAME'])]
  //setting table head data
  
  const forms = [
    {
        name : '노선',
        label : 'Line',
        options : Object.keys(rows).map((value, idx) => ({'value' : value, 'label' : value})),
        action : value => {
          setDay('')
          setLineName(value)
        },
        value : lineName, width : 45
    },
    {
        name : '날짜',
        label : 'Week Of Days',
        options : 
          (typeof(rows[lineName]) == 'undefined') ? ['None'] : 
            Object.keys(rows[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
        action : value => setDay(value),
        value : day, width : 45,
        disable : () => (lineName == '')
    },
  ]
  const getButtonList = stat => {
    switch(stat) {
      
      case 'update':
        return [{
          'label' : '노선수정',
          action : () => setState('update-line')
        },
        {
          'label' : '시간수정',
          action : () => setState('update-time')
        },
        {
          'label' : '배차수정',
          action : () => setState('update-bus')
        },
      ]
      case 'update-line':
      case 'update-time':
        return [{
          'label' : '돌아가기',
          action : () => setState('show')
        }]
      case 'show':
      default : 
        return [{
          'label' : '수정하기',
          action : () => setState('update')
        }]
    }
  }
  const buttons = getButtonList(stat)

  const displayComponent = () => {
    const empty = <NoData message='Please Select Options'/>
    var component = empty
    
    switch(stat) {
      case 'update-line':
        if(lineName === '' || day === '') break
        const now = rows[lineName][day]
        component = 
          <TransferList
            data = {stopName}
            chData = {now['LINE'].map(value => value['IDX'])}
            allData = {Object.keys(stopName).map((value:any) => value*1)}
            title = {'노선'}
            onSubmit = {data=>{
              //Data.setAPI('line', 'update', {
              //  'lineID' : lineID, 'data' : data
              //})
            } }
          />
        break
      case 'show':
      case 'update':
      case 'update-time':
      case 'default':
        if (!(lineName === '' || day === '')) {
          const now = rows[lineName][day]
          const record = Object.keys(now).map(key => {
            if(key !== 'LINE')
              return now[key].map(data => data['TIME'])
          }) 
          record.pop()
          const rowHead = Array.from({length : Object.keys(now).length-1}, (x, idx) => idx+1)
    
          component = <Table
            columnHead = {columns}
            rowHead = {rowHead}
            record = {record}
            stat={stat}/>
        }
    }

    
    
    return component
  }

  return (
    <div style={{
      width : '95%',
      margin:'0 auto',
      minWidth:'1021px',
      padding: '30px'
    }}>
      <Toolbar 
      title = '셔틀버스 시간표' 
      selectForm = {forms}
      buttons={buttons}/>
      {displayComponent()}
    </div>
  )
}

export default ShuttleLine;

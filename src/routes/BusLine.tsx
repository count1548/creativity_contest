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
import { Container } from "@material-ui/core"

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
    const [lineID, setLineID] = useState<any | null>('')

    let stopName:Object|null = null, rows:any[] = [], timeData = {}

    const [open, setOpen] = useState(false)
    
    //setting table head data
    useEffect(()=> {
      Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
      Data.getAPI('bus/line/', 'BUS_LINE', setLine)
      Data.getAPI('bus/time/', 'TIME_TABLE', setTime)
    }, [])

    //after data setting 데이터 가공
    if(stop != null) stopName = Data.dictToArr(stop, 'BUS_STOP_ID', 'BUS_STOP_NAME')
    if(stopName != null && line != null) rows = lineToRows(line, stopName)
    if(time != null) timeData = setTime_orderby_ID(time)
    
    //data setting
    

    const changeTime = (id, idx, value) => {
      timeData[id][idx] = value

      //setAPI
    }
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
          }]
        case 'update-line':
        case 'update-time':
          return [{
            'label' : '돌아가기',
            action : () => {
              setState('show')
            }
          }]
        case 'show':
        default : 
          return [{
            'label' : '수정하기',
            action : () => setState('update')
          }]
      }
    }
    const stoplist = Data.findFittedList(rows, campus, way)

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
      },
      {
          name : '노선',
          label : 'Line',
          options : (stoplist == null) ? 
            [] : stoplist.map(value => ({value : value['IDX'], label : value['NAME']})),
          action : value => setLineID(value),
          value : lineID,
          disable : () => (stoplist == null)
      },
    ]
   
    const buttons = getButtonList(stat)
    const displayComponent = () => {
      const empty = <NoData message='Please Select Options'/>
      var component = empty
      

      switch(stat) {
        case 'update-line':
          if(!stopName|| rows.length === 0 || lineID === '') break
          component = 
            <TransferList
              data = {stopName}
              chData = {rows[lineID]['DATA'].map(value => value['stopID'])}
              allData = {Object.keys(stopName).map((value:any) => value*1)}
              title = {'노선'}
              onSubmit = {data=>{
                Data.setAPI('line', 'update', {
                  'lineID' : lineID, 'data' : data
                })
              } }
            />
          break
        case 'show':
        case 'update':
        case 'update-time':
        case 'default':
          if (!(lineID === '' || rows.length == 0))
            component = <Table
              columnHead = {columns}
              rowHead = {rows[lineID]['DATA'].map(data => (data['stopName']))}
              record = {rows[lineID]['DATA'].map(data => timeData[data['timeID']])}
              stat={stat}
              />
          break
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
        title = '통학버스 시간표' 
        selectForm = {forms}
        buttons={buttons}/>
        {displayComponent()}
      </div>
    )
}

export default BusLine;

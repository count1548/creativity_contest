/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI} from '../data_function' 
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/Table'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress'
import Modal from '../component/Modal/Modal'
import Button from '@material-ui/core/Button';

import '../style/font.css'
import { LinearProgress } from "@material-ui/core"

const lineToRows = (dict:any, stop, lineIDX) => {
  const IDX =  dictToArr(lineIDX, 'IDX', 'SHUTTLE_STOP_ID')
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
  //return  dictToArr(dict, 'IDX_BUS_LINE', 'BUS_TIME', true)
  const data =  dictToArr_s(dict, 'LINE_NAME', 'CODE', null, true)
  for(var line_name in data) for(var code_name in data[line_name]) {
    data[line_name][code_name] =  dictToArr(data[line_name][code_name], 'BUS_ID', null, true)
  }
  return data
}
const lang = 'KOR_NAME'

async function getData() {
  const stop = await  getAPI('bus/shuttle/stop', 'result')
  const time = await  getAPI('bus/shuttle/time/', 'result')  // important api sql 구문에서 첫 노선 시간에 따른 정렬 순서대로 불러올것!
  const line = await  getAPI('bus/shuttle/line/', 'result')
  
  const stopName =  dictToArr(stop, 'SHUTTLE_STOP_ID', lang)
  const timeData = setTime_orderby_ID(time)
  const lineData = lineToRows(timeData, stopName, line)
  
  return {stopName, timeData, lineData}
}

let stopName:Object = {}, 
      lineData:Object = {}, 
      timeData:Object = {},
      columns:string[] = []

const ShuttleLine = props => {
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')
  const init = () => {
    setLineName('')
    setDay('')
  }
  let newLineName:string = '', newLineDay:string = ''
  //data setting
  useEffect(()=> {
    getData().then(res => {
      ({stopName, timeData, lineData} = res)
      setState('show')
    })
  }, [updated])
  if(stat === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>
  
  let selected = !(lineName === '' || day === '' || stat === 'create-line')
  if(selected) {
    if(!isAvailable(lineData[lineName]) || !isAvailable(lineData[lineName][day])) {
      init()
      return null
    }
    else columns = ['운행', ...lineData[lineName][day]['LINE'].map(value => value['NAME'])]
  }
  //setting table head data
  const IdxToID = (busidx) => {
    const key = Object.keys(lineData[lineName][day]).find((value, idx) => busidx === idx)
    return key
  }
  const dataToJson = ({row, column, value}) => {
    const key = IdxToID(row)
    return {
      BUS_ID : key,
      IDX_BUS_LINE : lineData[lineName][day][key][column],
      BUS_TIME : value
    }
  }

  const forms = [
    [{
        name : '노선',
        label : 'Line',
        ...(stat === 'create-line') ? {
          type : 'text',
          onChange : value => { newLineName = value },
          value:newLineName,
        } : {
          type : 'select',
          options : Object.keys(lineData).map((value, idx) => ({'value' : value, 'label' : value})),
          onChange : value => {
            setDay('')
            setLineName(value)
          },
          value:lineName,
          disable : () => (stat !== 'show')
        },
    },
    {
        name : '날짜',
        label : 'Days',
        ...(stat === 'create-line') ? {
          type : 'text',
          onChange : value => { newLineDay = value },
          value : newLineDay,
        }: {
          type : 'select',
          options : (typeof(lineData[lineName]) == 'undefined') ? ['None'] : 
            Object.keys(lineData[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
          onChange: value => setDay(value),
          value:day,
          disable : () => ((lineName == '') || (stat !== 'show'))
        },
    },]
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
  const equals = (obj1, obj2) => {
    if((obj1['IDX_BUS_LINE'] === obj2['IDX_BUS_LINE']) &&
    (obj1['BUS_ID'] == obj2['BUS_ID'])) return true
    return false
  }

  const displayComponent = () => {
    let listProps:{chData : any[], onSubmit (list : any[]) : any }|null = null,
        tableProps:{onSubmit (list : any[]) : any, button : string}|null = null

    let component = <NoData message='Please Select Options'/>

    switch(stat) {
      case 'create-line':
        listProps = {
          chData : [],
          onSubmit : list=>{
            setState('apply')
            //if(newLineName === '' || newLineDay === '' || list.length === 0) break
            setAPI('/bus/shuttle/line/create', {
              'lineName' : newLineName,
              'code' : newLineDay,
              'data' : list,
            }).then(res => { init(); setUpdated(!updated) })
          }
        }
        break
      case 'update-line':
        if(!selected) break
        listProps = {
          chData : lineData[lineName][day]['LINE'].map(value => value['IDX']),
          onSubmit : list => {
            setState('apply')
            //if(list.length === 0) break
            setAPI('/bus/shuttle/line/update', {
              'lineName' : lineName,
              'code' : day,
              'data' : list,
            }).then(res => setUpdated(!updated))
          }
        }
        break
      case 'update-time':
        if(!selected) break
        tableProps = {
          onSubmit : list => {
            setState('apply')
            setAPI(
             '/bus/shuttle/time/update', 
             {timeList : list.map(data => dataToJson(data))})
             .then(res => setUpdated(!updated))
          },
          button : 'apply'
        }
        break
      case 'delete-bus' :
        if(!selected) break
        tableProps = {
          onSubmit : list => {
            setState('apply')
            setAPI(
             '/bus/shuttle/bus/delete', 
             {delList : list.map(idx => IdxToID(idx))})
             .then(res => setUpdated(!updated))
          },
          button : 'delete'
        }
        break
    }

    if(stat.indexOf('line') !== -1) {if(listProps !== null) 
      component = <TransferList
        dataLabels = {stopName}
        allData = {Object.keys(stopName).map((value:any) => value*1)}
        title = {'노선'}
        {...listProps}
      />
    }

    else if(selected) {
      const now = lineData[lineName][day]
      const record = Object.keys(now).map(key => {
        if(key !== 'LINE')
          return now[key].map(data => data['TIME'].split(':').slice(0, 2).join(':'))
      }); record.pop()
      const rowHead = Array.from({length : Object.keys(now).length-1}, (x, idx) => idx+1)
      
      return (
        <Table
          columnHead = {columns}
          rowHead = {rowHead}
          record = {record}
          editable={stat === 'update-time'}
          headWidth={5}
          {...tableProps}
        />
    )}
    return component
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
          editable={true}
          headWidth={5}
          onChange={(bus, stop, value) => newBus[stop] = value }
          onSubmit = { ()=> {
            setState('apply')
             setAPI( '/bus/shuttle/time/create', 
            {
              lineName : lineName,
              day : day,
              timeList : lineData[lineName][day]['LINE'].map((value, idx) => ({
                'IDX_BUS_LINE': value['IDX'],
                'VALUE' : newBus[idx]
            }))}).then(res => setUpdated(!updated))      
          }}
      />
      break
      case 'delete-line':
        open = (stat === 'delete-line')
        component = <div style={{ textAlign:'center' }}>
          노선을 삭제하시겠습니까?<br/><br/><br/>
          <Button  variant="contained" color="secondary" onClick = {() => {
            setState('apply')
             setAPI('/bus//shuttle/line/delete', {
              'lineName' : lineName,
              'code' : day,
            }).then(res => setUpdated(!updated))
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
      inputForm = {forms}
      buttons={getButtonList(stat)}/>
      {displayComponent()}
      {displayModal()}
    </div>
  )
}

export default ShuttleLine;

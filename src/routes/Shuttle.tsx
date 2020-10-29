/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/'
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI} from '../data_function' 
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import '../style/lineTable.css'
import Toolbar from '../component/Toolbar'
import Table from '../component/Table/'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress'
import Dialog from '../component/Dialog'

import '../style/font.css'
import { LinearProgress } from "@material-ui/core"

const lineToRows = (dict:any, lineIDX) => {
  const IDX =  dictToArr(lineIDX, 'IDX', 'SHUTTLE_STOP_NAME')
  for(var line in dict) for(var day in dict[line]) for(var bus in dict[line][day])  {
    const now = dict[line][day][bus]
    dict[line][day]['LINE'] = now.map(value => ({
      'IDX' : value['IDX_BUS_LINE'], 
      'NAME' : IDX[value['IDX_BUS_LINE']]
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
  const stop = await  getAPI('bus/shuttle/stop/', 'result')
  const time = await  getAPI('bus/shuttle/time/', 'result')  // important api sql 구문에서 첫 노선 시간에 따른 정렬 순서대로 불러올것!
  const line = await  getAPI('bus/shuttle/line/', 'result')
  
  const stopName =  stop.map(value => value['SHUTTLE_STOP_NAME'])
  const timeData = setTime_orderby_ID(time)
  const lineData = lineToRows(timeData, line)
  
  return {stopName, timeData, lineData}
}

let stopName:string[] = [], columns:string[] = [],
    lineData:Object = {}, timeData:Object = {},
    newLineName:string = '', newLineDay:string = ''

const ShuttleLine = props => {
  const [state, setState] = useState('apply')

  const [required, setRequired] = useState(false)
  const [updated, setUpdated] = useState(true)
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')
  const init = () => {
    setLineName('')
    setDay('')
    newLineName = ''
    newLineDay = ''
  }
  //data setting
  useEffect(()=> {
    getData().then(res => {
      ({stopName, timeData, lineData} = res)
      const _name = Object.keys(lineData)[0]

      setLineName(_name)
      setDay(Object.keys(lineData[_name])[0])

      setState('show')
    })
  }, [updated])
  if(state === 'apply') return <div style={{width:'300px', margin:'30px auto'}}><Loading size={200}/></div>
  
  let selected = !(lineName === '' || day === '')
  if(selected) {
    if(!isAvailable(lineData[lineName]) || !isAvailable(lineData[lineName][day])) {
      init()
      return null
    }
    else columns = ['운행', ...lineData[lineName][day]['LINE'].map(value => value['NAME'])]
  }
  
  //setting table head data
  const IdxToID = busidx => {
    const key = Object.keys(lineData[lineName][day]).find((value, idx) => busidx === idx)
    return key
  }
  const dataToJson = ({row, column, value}) => {
    const key = IdxToID(row)
    return {
      BUS_ID : key,
      IDX_BUS_LINE : lineData[lineName][day]['LINE'][column]['IDX'],
      BUS_TIME : value
    }
  }

  const forms = [
    [{
        name : '노선',
        label : 'Line',
        ...(state === 'create-line') ? {
          type : 'text',
          onChange : value => { newLineName = value },
          value:newLineName,
        } : {
          type : 'select',
          options : Object.keys(lineData).map((value, idx) => ({'value' : value, 'label' : value})),
          onChange : value => {
            setDay(Object.keys(lineData[value])[0])
            setLineName(value)
          },
          value:lineName,
          disable : () => (state !== 'show')
        },
    },
    {
        name : '날짜',
        label : 'Days',
        ...(state === 'create-line') ? {
          type : 'text',
          onChange : value => { newLineDay = value },
          value : newLineDay,
        }: {
          type : 'select',
          options : (typeof(lineData[lineName]) == 'undefined') ? ['None'] : 
            Object.keys(lineData[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
          onChange: value => setDay(value),
          value:day,
          disable : () => ((lineName == '') || (state !== 'show'))
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

  const getButtonList = state => {
    let bntlist:Object[] = [buttons['return']]

    switch(state) {
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
        tableProps:{selectable? : boolean, onSubmit (list : any[]) : any, button : string}|null = null

    let component = <NoData message='Please Select Options'/>

    switch(state) {
      case 'create-line':
        listProps = {
          chData : [],
          onSubmit : list=>{
            if(newLineName === '' || newLineDay === '' || list.length < 2) {
              setRequired(true)
              return
            }
            setState('apply')
            setAPI('shuttle/line/create', {
              'lineName' : newLineName,
              'code' : newLineDay,
              'data' : list,
            }).then(res => { init(); setUpdated(!updated) })
          }
        }
        break
      case 'update-line':
        listProps = {
          chData : lineData[lineName][day]['LINE'].map(value => value['NAME']),
          onSubmit : list => {
            if(list.length < 2) { setRequired(true); return }
            setState('apply')
            //if(list.length === 0) break
            setAPI('shuttle/line/update', {
              'lineName' : lineName,
              'code' : day,
              'data' : list,
            }).then(res => setUpdated(!updated))
          }
        }
        break
      case 'update-time':
        tableProps = {
          onSubmit : list => {
            setState('apply')
            setAPI(
             'shuttle/time/update', 
             {info : {
               lineName : lineName,
               code : day
             }, timeList : list.map(data => dataToJson(data))})
             .then(res => setUpdated(!updated))
          },
          button : 'apply'
        }
        break
      case 'delete-bus' :
        tableProps = {
          selectable : true,
          onSubmit : list => {
            setState('apply')
            setAPI(
             'shuttle/bus/delete', 
             {delList : list.map(idx => IdxToID(idx))})
             .then(res => setUpdated(!updated))
          },
          button : 'delete'
        }
        break
    }

    if(state === 'create-line' || state === 'update-line') { if(listProps !== null) 
      component = <TransferList
        allData = {stopName}
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
          column = {columns}
          rowHead = {rowHead}
          record = {record}
          editable={state === 'update-time'}
          headWidth={5}
          {...tableProps}
        />
    )}
    return component
  }
  const displayModal = () => {
    if(!selected) return null
    const newBus = new Array(columns.length-1)
    let dialogProps:Object|null = null

    switch(state) {
      case 'create-bus':
        dialogProps = {
          type : 'component', 
          submitMsg : '생성',
          children : <Table
            column = {columns}
            rowHead = {['BUS']}
            record = {[newBus]}
            editable={true}
            headWidth={5} button={null}
            onChange={(bus, stop, value) => newBus[stop] = value }
            style={{
              tablePaper : {
                textAlign:'center',
                width : '100%',
              },
            }}
            />,
          onSubmit : ()=> {
            setState('apply')
            setAPI( 'shuttle/bus/create', 
            {
              lineName : lineName,
              day : day,
              timeList : lineData[lineName][day]['LINE'].map((value, idx) => ({
                'IDX_BUS_LINE': value['IDX'],
                'VALUE' : newBus[idx]
            }))}).then(res => setUpdated(!updated))
          },
        }
        break
      case 'delete-line':
        dialogProps = {
          type : 'text',
          submitMsg : '삭제',
          children : '노선을 삭제하시겠습니까?',
          onSubmit : () => {
            setState('apply')
             setAPI('shuttle/line/delete', {
              'lineName' : lineName,
              'code' : day,
            }).then(res => setUpdated(!updated))
            init()
          }
        }
        break
    }
    if(dialogProps !== null) return (
      <Dialog
        onClose={() => setState('show')}
        title={'배차 생성'}
        defaultState={true}
        {...dialogProps}
      />
    )
    else return null
  }
  return (
    <div>
      <Toolbar 
      title = '셔틀버스 시간표' 
      inputForm = {forms}
      buttons={getButtonList(state)}/>
      {displayComponent()}
      {displayModal()}
      <Dialog
        children={'필수 항목을 입력하십시오'}
        onClose = {()=>setRequired(false)}
        defaultState={required}
      />
    </div>
  )
}

export default ShuttleLine;

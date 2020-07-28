/*eslint-disable */
import React, {useState, useEffect}  from "react"
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {getAPI} from '../data_function'
import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import '../style/font.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root : { 
      width : '95%',
      margin:'0 auto',
      minWidth:'1021px',
      padding: '30px'
    },
    busStop: {
      display: 'inline-block',
      padding: '20px 0px',
      textAlign: 'center',
      borderLeft: '1px solid gray',
      cursor : 'default',
    },
    table: {
      width:'100%',
      margin : '0 auto',
      borderRadius: '15px',
      minWidth: 800,
    },
    filledCell : {
      background: '#2c537a',
      fontFamily:'NanumSquareRoundR',
      color : '#fff'
    },
    firstCell : {
      background: '#376b9f',
      fontFamily:'NanumSquareRoundR',
      color : '#fff'
    }
  }),
)

const lineToRows = (dict:any, stop, lineIDX) => {
  let rows:any = [], obj = {}
  const IDX = Data.dictToArr(lineIDX, 'IDX', 'SHUTTLE_STOP_ID')
  for(var line in dict) for(var day in dict[line]) for(var bus in dict[line][day])  {
    const now = dict[line][day][bus]
    dict[line][day]['LINE'] = now.map(value => stop[IDX[value['IDX_BUS_LINE']]])
    dict[line][day][bus] = now.map((value, idx) => ({
      'IDX_BUS_LINE' : value['IDX_BUS_LINE'],
      'TIME' : value['BUS_TIME'],
    }))
  }
  console.log(dict)
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


const ShuttleLine = props => {
  const [stat, setState] = useState('update-line')

  const [stop, setStop] = useState<any | null>(null)
  const [line, setLine] = useState<any | null>(null)
  const [time, setTime] = useState<any | null>(null)
  const lang = 'KOR_NAME'
  
  const [lineName, setLineName] = useState('') 
  const [day, setDay] = useState('')

  let stopName:Object|null = null, columns:Object = {}, timeData:Object|null = null
  const classes = useStyles(); 

  //data setting
  useEffect(()=> {
    Data.getAPI('bus/shuttle/stop', 'result', setStop)
    Data.getAPI('bus/shuttle/line/', 'result', setLine)
    Data.getAPI('bus/shuttle/time/', 'result', setTime)
  }, [])

  //setting table head data
  const rows:any[] = [{
      title : '운행', 
      field : 'IDX', width:100, 
      cellStyle : { padding:'0px 10px', textAlign:'center' as const } 
  }]
  
  //after data setting 데이터 가공
  if(stop != null) stopName = Data.dictToArr(stop, 'SHUTTLE_STOP_ID', lang)
  if(time != null) timeData = setTime_orderby_ID(time)
  if(stopName != null && timeData != null && line != null) 
    //columns = lineToRows(line, stopName, timeData)
    columns = lineToRows(timeData, stopName, line)

  //setting table head data
  if(lineName !== '' && day !== '') {
    columns[lineName][day]['LINE'].map(value => rows.push({
      title : value,
      cellStyle : { padding:'0px 10px', textAlign:'center' as const } 
    }))
  }
  
  //setting table row(stop : time) data
  const createRowData = (row:any[]) => {
    if(row == null) return null
    const res:any[] = []
    var idx = 1
    for(var bus in row) {
      if(bus == 'LINE') break
      res.push(
        <TableRow key={idx}>
        <TableCell component="th" scope="row" className={classes.filledCell}>{(idx++)}</TableCell>
        {row[bus].map((data, key)=>
          <TableCell align="center" key={key}>{data['TIME']}</TableCell>
        )}
      </TableRow>
      )
    }
    return res
  }

  const forms = [
    {
        name : '노선',
        label : 'Line',
        options : Object.keys(columns).map((value, idx) => ({'value' : value, 'label' : value})),
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
          (typeof(columns[lineName]) == 'undefined') ? ['None'] : 
            Object.keys(columns[lineName]).map((value, idx) => ({'value' : value, 'label' : value})),
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
        }]
      case 'update-line':
      case 'update-time':
        return [{
          'label' : '적용하기',
          action : () => setState('apply')
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
    const empty = <div>No Data...</div>

    const component = (rows.length < 2 || (Object.keys(columns).length === 0)) ? empty :
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {rows.map((row, idx) => {
                const style = (idx == 0) ? classes.firstCell : classes.filledCell
                return <TableCell key={idx} align='center'  className={style}>{row.title}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
          {createRowData(columns[lineName][day])}
          </TableBody>
        </Table>
      </TableContainer>
    
    return component
  }

  return (
    <div className={classes.root}>
      <Toolbar 
      title = '통학버스 시간표' 
      selectForm = {forms}
      buttons={buttons}/>
      {displayComponent()}
    </div>
  )
}

export default ShuttleLine;

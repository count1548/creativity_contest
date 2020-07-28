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

const lineToRows = (dict:any[], stop, time) => {
  let rows:any = [], obj = {}
  const data = Data.dictToArr_s(dict, 'LINE_NAME', 'CODE', null, true)
  
  for(var line in data) for(var day in data[line]) {
    const now = data[line][day]
    data[line][day]['DATA'] = now.map((value, idx) => ({
      'STOP_NAME' : stop[value['SHUTTLE_STOP_ID']],
      'TIME' : time[value['IDX']],
    }))
    data[line][day]['COUNT'] = 
      (typeof(data[line][day]['DATA'][0]['TIME']) == 'undefined') ? 0 : data[line][day]['DATA'][0]['TIME'].length
  }
  return data
}

const setTime_orderby_ID = (dict:any[]) =>  {
  return Data.dictToArr(dict, 'IDX_BUS_LINE', 'BUS_TIME', true)
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
    columns = lineToRows(line, stopName, timeData)
  if(lineName !== '' && day !== '') {
    columns[lineName][day]['DATA'].map(value => rows.push({
      title : value['STOP_NAME'],
      cellStyle : { padding:'0px 10px', textAlign:'center' as const } 
    }))
  }
  
  //setting table row(stop : time) data
  const createRowData = (row:any[]) => {
    if(row == null) return null
    const res:any[] = []
    for(var idx = 0; idx < row['COUNT']; idx++) {
      res.push(
      <TableRow key={idx}>
        <TableCell component="th" scope="row" className={classes.filledCell}>{(idx+1)}</TableCell>
        {Object.keys(row['DATA']).map((data, key)=>
          <TableCell align="center" key={key}>{row['DATA'][data]['TIME'][idx]}</TableCell>
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

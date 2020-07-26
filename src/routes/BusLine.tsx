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

const lineToRows = (dict:any[], stop) => {
  let rows:any = [], obj = {}
  const data = Data.dictToArr(dict, 'BUS_LINE_ID', null, true)

  for(var key in data) {
    data[key].sort((a, b) => 
      (a['LINE_SEQUENCE'] < b['LINE_SEQUENCE'] ? -1 : 1))
    const stop_data:any[] = data[key].map(value => ({
        stopName : stop[value['BUS_STOP_ID']],
        timeID : value['IDX_BUS_LINE']
    }))
    rows.push({
      'LINE': key,
      'DATA' : stop_data
    })
  }
  return rows
}

const setTime_orderby_ID = (dict:any[]) =>  {
  return Data.dictToArr(dict, 'IDX_BUS_LINE', 'BUS_TIME', true)
}

const WoDKor = {'Mon' : '월', 'Tue' : '화', 'Wed' : '수', 'Thu' : '목', 'Fri' : '금'}

const BusLine = props => {
    const [stop, setStop] = useState<any | null>(null)
    const [line, setLine] = useState<any | null>(null)
    const [time, setTime] = useState<any | null>(null)
    
    const [campus, setCampus] = useState('') 
    const [way, setWay] = useState('')
    const [lineID, setLineID] = useState<any | null>('')

    let stopName:Object|null = null, columns = [], timeData = {}

    const [open, setOpen] = useState(false)
    const classes = useStyles(); 
    
    //setting table head data
    const rows:any = [{
        title : '노선', 
        field : 'ID', width:100, 
        cellStyle : { padding:'0px 10px', textAlign:'center' as const } 
    }]
    for (var key in WoDKor) rows.push({ title : WoDKor[key],  field : key, })

    //after data setting 데이터 가공
    if(stop != null) stopName = Data.dictToArr(stop, 'BUS_STOP_ID', 'BUS_STOP_NAME')
    if(stopName != null && line != null) columns = lineToRows(line, stopName)
    if(time != null) timeData = setTime_orderby_ID(time)
    //data setting
    useEffect(()=> {
      Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
      Data.getAPI('bus/line/', 'BUS_LINE', setLine)
      Data.getAPI('bus/time/', 'TIME_TABLE', setTime)
    }, [])
    
    //setting table row(stop : time) data
    const createRowData = (row:any[]) => {
      if(row == null) return null

      const rowData = row['DATA']
      return rowData.map((stop, idx) =>
        <TableRow key={idx}>
          <TableCell component="th" scope="row" className={classes.filledCell}>{stop['stopName']}</TableCell>
          {(timeData[stop['timeID']] == null) ? null:
            timeData[stop['timeID']].map((time, idx) =>
              <TableCell align="center" key={idx}>{time}</TableCell>
            )}
        </TableRow>
      )
    }
    
    const stoplist = Data.findFittedList(columns, campus, way)

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

    return (
      columns.length == 0 || time == null || rows.length == 0? 
        <div>Loading...</div>:
        <div className={classes.root}>
          <Toolbar title = '통학버스 시간표' data = {forms}/>          
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
                {createRowData(columns[lineID])}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    )
}

export default BusLine;

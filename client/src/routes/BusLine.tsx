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
  let data = {}, rows:any = [], obj = {}
  dict.map(d => {
    if(typeof(data[d['BUS_LINE_ID']]) == 'undefined') data[d['BUS_LINE_ID']] = []
    data[d['BUS_LINE_ID']].push({
      'SEQUENCE' : d['LINE_SEQUENCE'],
      'STOP_NAME' : stop[d['BUS_STOP_ID']],
      'TIME_ID' : d['IDX_BUS_LINE']
    })
  })
  for(var key in data) {
    data[key].sort((a, b) => 
      (a['SEQUENCE'] < b['SEQUENCE'] ? -1 : 1))
    const stop_data:any[] = data[key].map(value => ({
        stopName : value['STOP_NAME'],
        timeID : value['TIME_ID']
    }))
    rows.push({
      'LINE': key,
      'DATA' : stop_data
    })
  }
  return rows
}

const setTime_orderby_ID = (dict:any[]) =>  {
  let data = {}
  dict.map(d => {
    if(typeof(data[d['IDX_BUS_LINE']]) == 'undefined') data[d['IDX_BUS_LINE']] = []
    data[d['IDX_BUS_LINE']].push(d['BUS_TIME'])
  })
  return data
}

const WoDKor = {'Mon' : '월', 'Tue' : '화', 'Wed' : '수', 'Thu' : '목', 'Fri' : '금'}

const BusLine = props => {
    const [stop, setStop] = useState<any | null>(null)
    const [line, setLine] = useState<any | null>(null)
    const [time, setTime] = useState<any | null>(null)
    
    const [lineID, setLineID] = useState<any | null>(0)

    let columns = [], timeData = {}

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
    if(stop != null && line != null) columns = lineToRows(line, stop)
    if(time != null) timeData = setTime_orderby_ID(time)

    //data setting
    useEffect(()=> {
      Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
      Data.getAPI('bus/line/', 'BUS_LINE', setLine)
      Data.getAPI('bus/time/', 'TIME_TABLE', setTime)
    }, [])
    
    //setting table row data
    const createRowData = (rowData:any[]) => {
      console.log(columns)
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
    
    return (
      columns.length == 0 || time == null || rows.length == 0? 
        <div>Loading...</div>:
        <div className={classes.root}>
          <Toolbar 
            title = '통학버스 시간표'
            data = {columns}
            changeLine = {setLineID}/>
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
                {createRowData(columns[lineID]['DATA'])}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    )
}

export default BusLine;

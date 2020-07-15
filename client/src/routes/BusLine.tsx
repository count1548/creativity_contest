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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    busStop: {
      display: 'inline-block',
      padding: '20px 0px',
      textAlign: 'center',
      borderLeft: '1px solid gray',
      cursor : 'default',
    },
    table: {
      minWidth: 650,
    },
  }),
)

const lineToRows = (dict:any[], stop) => {
  let data = {}, rows:any = [], obj = {}
  dict.map(d => {
    if(typeof(data[d['BUS_LINE_ID']]) == 'undefined') data[d['BUS_LINE_ID']] = new Array()
    data[d['BUS_LINE_ID']].push({
      'SEQUENCE' : d['LINE_SEQUENCE'],
      'STOP_ID' : stop[d['BUS_STOP_ID']],
      'TIME_ID' : d['IDX_BUS_LINE']
    })
  })
  for(var key in data) {
    data[key].sort((a, b) => 
      (a['SEQUENCE'] < b['SEQUENCE'] ? -1 : 1))
    const stop_data = data[key].map(value => ({
        stopName : value['STOP_ID'], 
        timeID : value['TIME_ID']
    }))
    rows.push({
      'LINE': key,
      'DATA' : stop_data
    })
  }
  console.log(typeof(rows[0]['DATA']))
  return rows
}

const setTime_orderby_ID = (dict:any[]) => {
  let data = {}
  dict.map(d => {
    if(typeof(data[d['IDX_BUS_LINE']]) == 'undefined') data[d['IDX_BUS_LINE']] = new Array()
    data[d['IDX_BUS_LINE']].push(d['BUS_TIME'])
  })
  return data
}

const WoDKor = {'Mon' : '월', 'Tue' : '화', 'Wed' : '수', 'Thu' : '목', 'Fri' : '금'}

const setTableData = () => {

}

const Notice = props => {
    const [stop, setStop] = useState<any | null>(null)
    const [line, setLine] = useState<any | null>(null)
    const [time, setTime] = useState<any | null>(null)
    let columns = [], rowsData = {}

    const [open, setOpen] = useState(false)
    const classes = useStyles(); 
    
    const rows:any = [{
        title : '노선', 
        field : 'ID', width:100, 
        cellStyle : { padding:'0px 10px', textAlign:'center' as const } 
    }]

    for (var key in WoDKor) rows.push({ title : WoDKor[key],  field : key, })

    const defaultEdit = {
      onRowDelete : oldData => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve();
              }, 600);
      })},
    }

    if(stop != null && line != null) {
      columns = lineToRows(line, stop)
      console.log(typeof(columns[0]['DATA']))
    }
    if(time != null) rowsData = setTime_orderby_ID(time)
    useEffect(()=> {
      Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
      Data.getAPI('bus/line/', 'BUS_LINE', setLine)
      Data.getAPI('bus/time/', 'TIME_TABLE', setTime)
    }, [])
    console.log(columns)

    return (
      columns.length == 0 || time == null ? 
        <div>Loading...</div>:
        <div>
          <Toolbar title='통학버스 시간표'/>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {rows.map((row, idx) => 
                    <TableCell key={idx}>{row.title}</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
              {
              columns[0]['DATA'].map((stop, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row">{stop['stopName']}</TableCell>
                  {rowsData[stop['timeID']].map((value, idx) => 
                    <TableCell align="right" key={idx}>{value}</TableCell>
                  )}
                </TableRow>
              ))
              }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    )
}

export default Notice;

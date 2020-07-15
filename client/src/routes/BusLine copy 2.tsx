import React, {useState, useEffect}  from "react"
import Table from 'material-table'
import TransferList from '../component/LineList/TransferList'
import * as Data from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import {getAPI} from '../data_function'
import axios from 'axios'
import '../style/lineTable.css'
import Toolbar from '../component/Table/Toolbar'
import MTableToolbar from 'material-table'
import { Chip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    busStop: {
      display: 'inline-block',
      padding: '20px 0px',
      textAlign: 'center',
      borderLeft: '1px solid gray',
      cursor : 'default',
    },
  }),
)

const lineToRows = (dict:any[], stop) => {
  let data = {}, rows:any = [], obj = {}
  dict.map(d => {
    if(typeof(data[d['BUS_LINE_ID']]) == 'undefined')
      data[d['BUS_LINE_ID']] = new Array()
    data[d['BUS_LINE_ID']].push({
      'SEQUENCE' : d['LINE_SEQUENCE'],
      'STOP_ID' : stop[d['BUS_STOP_ID']]
    })
  })

  for(var key in data) {
    let pathArr = []
    data[key].sort((a, b) => 
      (a['SEQUENCE'] < b['SEQUENCE'] ? -1 : 1))
    pathArr = data[key].map(value => value['STOP_ID'])
    rows.push({
      'ID': key,
      'PATH' : pathArr.join(' '),
    })
  }  

  return rows
}

const WoDKor = {'Mon' : '월', 'Tue' : '화', 'Wed' : '수', 'Thu' : '목', 'Fri' : '금'}

const Notice = props => {
    const [stop, setStop] = useState<any | null>(null)
    const [line, setLine] = useState<any | null>(null)
    let rows=[]

    const [open, setOpen] = useState(false)
    const classes = useStyles(); 
    
    const columns = [
      {title : '노선', field : 'ID', width:100, cellStyle : { padding:'0px 10px', textAlign:'center' as const } },
      {title : '경로', field : 'PATH', 
        render : rowData => {
          const path = rowData['PATH'].split(' ')
          const len = path.length
          return (
            <div className='line-box'>
              {path.map((stop, idx) => {
                var style = {
                  width : `calc(${100 / len}% - ${len*1}px)`,
                  borderRight:'0px'
                }
                return <div className={classes.busStop} style={style} key={idx}>{stop}</div>
            })}
            </div>
          )
        },  cellStyle : { padding:'0px 10px' } }
    ]    

    const defaultEdit = {
      onRowDelete : oldData => {
          //Data.updateData({}, 'LineList')
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve();
              }, 600);
      })},
    }

    if(stop != null && line != null)
        rows = lineToRows(line, stop)

    useEffect(()=> {
      Data.getAPI('bus/stop/', 'BUS_STOP', setStop)
      Data.getAPI('bus/line/', 'BUS_LINE', setLine)
    }, [])

    return (
      rows.length == 0 ? 
        <div>Loading...</div>:
        <div>
          <Toolbar title='통학버스 시간표'/>
          <Table
              title="통학버스 시간표"
              data={rows}
              editable = {defaultEdit}
              actions = {[{
                  icon : 'update', 
                  tooltip : 'timetable',
                  onClick : (ev, data) => {},
              }]}
              columns={columns}
              options={{
                columnsButton: true,
                rowStyle: { 
                    backgroundColor: '#EEE',
                    padding:'dense'
                },
                actionsColumnIndex: -1,
                pageSize: 10,
                padding:'dense',
              }}
              components={{
                Toolbar: props => (
                  <div></div>
                ),
              }}
          />
        </div>
    )
}

export default Notice;

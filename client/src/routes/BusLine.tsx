import React, {useState, useEffect}  from "react";
import Table from 'material-table';
import TransferList from '../component/LineList/TransferList';
import * as Data from '../data_function';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {getData_s} from '../data_function'
import axios from 'axios'
import '../style/lineTable.css'

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

const dictToArr = (dict:any[]) => {
    let column = {}
    dict.map(data => column[data['BUS_STOP_ID']] = data['BUS_STOP_NAME'])
    return column
}
const lineToArr = (dict:any[], stop) => {
  let data = {}
  dict.map(d => {
    if(typeof(data[d['BUS_LINE_ID']]) == 'undefined')
      data[d['BUS_LINE_ID']] = new Array()
    data[d['BUS_LINE_ID']].push({
      'SEQUENCE' : d['LINE_SEQUENCE'], 
      'BUS_STOP' : stop[d['BUS_STOP_ID']]
    })
  })
  return data
}

const Notice = props => {
    const [stop, setStop] = useState<any | null>(null)
    const [line, setLine] = useState<any | null>(null)
    let stopName, lineArr, columnData : any[] = []

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

    if(stop != null) {
      stopName = dictToArr(stop)
      if(line != null) {
        lineArr = lineToArr(line, stopName)
        for(var key in lineArr) {
          let pathArr = []
          lineArr[key].sort((a, b) => 
            (a['SEQUENCE'] < b['SEQUENCE'] ? -1 : 1))

          pathArr = lineArr[key].map(value => value['BUS_STOP'])
          columnData.push({
            'ID': key,
            'PATH' : pathArr.join(' '),
          })
        }        
      }
    }
    useEffect(()=> {
      getData_s({target : 'bus_stop'}, setStop)
      getData_s({target : 'bus_line'}, setLine)
    }, [])
    return (
      columnData.length == 0 ? 
        <div>Loading...</div>:
        <Table
            title="노선"
            data={columnData}
            editable = {defaultEdit}
            actions = {[
              {
                icon : 'update', 
                tooltip : 'timetable',
                onClick : (ev, data) => {},
              }
            ]}
            columns={columns}
            options={{
                rowStyle: { 
                    backgroundColor: '#EEE',
                    padding:'dense'
                },
                actionsColumnIndex: -1,
                pageSize: 10,
                padding:'dense',
            }}
        />
    )
}

export default Notice;

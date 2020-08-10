import React, {useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import NoData from './NoData'
import Button from '@material-ui/core/Button';

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
      width:'100%',
      margin : '0 auto',
      borderRadius: '15px',
      '&::-webkit-scrollbar' : {
          display:'none'
      }
    },
    headCell : {
      fontFamily:'NanumSquareRoundR',
      color : '#fff',
      backgroundColor : '#2c537a',
      wordBreak : 'keep-all',
    },
    submit : {
        display : 'block',
        margin : '10px auto'
    }
  }),
)

const getStyle = (id, idx, length, headWidth, delList, head = false, rowHead = true) : Object => {
    let style:Object = {}
    if(head) {
        switch(idx) {
            case 0:
                style = {
                    backgroundColor:'#376b9f',
                    borderRight : '1px solid white',
                    width:`${headWidth}%`
                }
                break
            default:
                if(idx !== length - 1)
                    style = {
                        borderRight : '1px solid white', 
                        width:`${(100-headWidth)/(length-1)}%`
                    }
                break
            } 
    }
    else {
        if (rowHead) switch(idx) {
            case 0:
                style =  {
                    borderRight : '1px solid white',
                    textAlign:'center'
                }
                break
            case length-1:
                style =  {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                }
                break
            default:
                style =  {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                    borderRight : '1px solid white',
                }
                break
        }
        else switch(idx) {
            case length-1:
                style =  {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                }
                break
            default:
                style =  {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                    borderRight : '1px solid white',
                }
                break
        }
        if(delList.indexOf(id) > -1) {
            switch(idx) {
                case 0:
                    style['backgroundColor'] = '#A1537A'
                    break
                default:
                    style['backgroundColor'] = '#EEB8EE'
                    break
            }
        }
    }
    
    return style
}

const equals = (obj, target) => {
    if((obj['row'] === target['row']) &&
        (obj['column'] === target['column'])) return true
    return false
}

const CustomTable = (props) => {
    const {columnHead, rowHead=null, record, 
        onChange = ()=>{}, onSubmit, 
        headWidth, style=null, editable=false,
        button = null, onClick=()=>{},
        maxHeight = null} = props
    
    const [delList, setList] = useState<number[]>([])
    useEffect(()=>setList([]), [])
    const classes = useStyles()
    const changeList:Object[] = []
    if(columnHead.length === 0 || record.length === 0)
        return <NoData message='Please Select Options' />

    const tableStyle = (style === null) ? classes.table : style
    const rowData = (rowHead === null) ? record:
        rowHead.map((data, idx) => [data].concat(record[idx]))
    const columnData:string[] = columnHead
    const columnCount = columnData.length

    const displayCell = (id, idx, data) => {
        const value = (typeof(data) === 'undefined') ? '' : data
        if(editable) return (idx === 0) ? value : <TextField
                id={`${id}-${idx}`}
                defaultValue={value}
                type='time'
                onChange={ ev => {
                    const changeval = ev.target.value
                    console.log(record)
                    record[id][idx-1] = changeval //실제 보이는 데이터 변경

                    const chObject = {
                        row : id,
                        column : idx - 1,
                        value : changeval
                    }
                    var flag = false

                    changeList.forEach(data => {
                        if(equals(data, chObject)) {
                            flag = true
                            data['value'] = chObject['value']
                            return true
                        }
                    })
                    if(!flag) changeList.push(chObject)

                    onChange(id, idx-1, changeval)
                }}/>
        else return value
    }

    const getButton = () => {
        let color, msg, onClick
        switch(button) {
            case 'apply':
                color = 'primary'
                msg = 'Submit'
                onClick = () => onSubmit(changeList)
                break
            case 'delete':
                color = 'secondary'
                msg = 'Delete'
                onClick = ()=>onSubmit(delList)
                break
            default:
            return null
        }
        return (
            <Button 
                variant="contained" 
                color={color} 
                className={classes.submit}
                onClick={onClick}>{msg}</Button>
        )
    }

    const selectHandle = (val:number) => {
        const idx = delList.indexOf(val)
        const cp = delList.slice()

        if(idx > -1) cp.splice(idx, 1)
        else  cp.push(val)
        setList(cp)
        onClick(val)
    }

    const component = <div>
        <TableContainer component={Paper} className={tableStyle} style={{
            maxHeight: maxHeight,
        }}>
            <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                {columnData.map((column, idx) => 
                    <TableCell 
                        key={idx} align='center' 
                        className={classes.headCell}
                        style={getStyle(null, idx, columnCount, headWidth, delList, true)}
                        children={column}/>
                )}
                </TableRow>
            </TableHead>
            <TableBody>
            {
                rowData.map((row, idx) => 
                    <TableRow key={idx} 
                        {...(button === 'delete') ? 
                            {onClick : ()=>selectHandle(idx)} : 
                            {onClick : ()=> onClick(idx)}}>
                        {columnData.map((data, idx2) => 
                            <TableCell 
                                component="th" scope="row" 
                                className={classes.headCell}
                                style={getStyle(idx, idx2, columnCount, headWidth, delList, false, rowHead!==null)}
                                key={idx2}
                                children={displayCell(idx, idx2, row[idx2])}/>)
                        }
                    </TableRow>
                )
            }
            </TableBody>
            </Table>
        </TableContainer>
        {getButton()}
    </div>

    return (
        component
    )
}

export default CustomTable
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

import Button from '@material-ui/core/Button';

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

const getStyle = (id, idx, length, headWidth, delList, head = false) : Object => {
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
        switch(idx) {
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

const CustomTable = (props) => {
    const {columnHead, rowHead, record, stat, onChange, onSubmit, headWidth} = props

    const [delList, setList] = useState<number[]>([])
    useEffect(()=>setList([]), [stat])
    const classes = useStyles()
    const rowData = rowHead.map((data, idx) => [data].concat(record[idx]))
    const columnData:string[] = columnHead
    const columnCount = columnData.length

    const displayCell = (id, idx, data) => {
        const value = (typeof(data) === 'undefined') ? '' : data
        switch(stat) {
            case 'update-time':
               return (idx === 0) ? value : <TextField
                        id={`${id}-${idx}`}
                        defaultValue={value}
                        onChange={ ev => onChange(id, idx-1, ev.target.value)}/>
            case 'show':
            default :
            return value
        }
    }

    const submit = state => {
        let color, msg, onClick
        switch(state) {
            case 'update-time':
                color = 'primary'
                msg = 'Submit'
                onClick = ()=>onSubmit()
                break
            case 'delete-bus':
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

    const clickHandle = (val:number) => {
        const idx = delList.indexOf(val)
        const cp = delList.slice()

        if(idx > -1) cp.splice(idx, 1)
        else  cp.push(val)
        setList(cp)
    }
    return (
        <div>
            <TableContainer component={Paper} className={classes.table}>
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
                        <TableRow key={idx} {
                            ...(stat === 'delete-bus') ? {onClick : ()=>clickHandle(idx)} : null
                        }>
                            {columnData.map((data, idx2) => 
                                <TableCell 
                                    component="th" scope="row" 
                                    className={classes.headCell}
                                    style={getStyle(idx, idx2, columnCount, headWidth, delList)}
                                    key={idx2}
                                    children={displayCell(idx, idx2, row[idx2])}/>)
                            }
                        </TableRow>
                    )
                }
                </TableBody>
                </Table>
            </TableContainer>
            {submit(stat)}
        </div>
    )
}

export default CustomTable
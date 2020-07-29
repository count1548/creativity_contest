import React from 'react';
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
    },
    
    inputCell : {
      width:'110px',
      textAlign:'center',
    },
    submit : {
        display : 'block',
        margin : '10px auto'
    }
  }),
)

const getStyle = (idx, length, head = false) : Object => {
    if(head) {
        switch(idx) {
            case 0:
                return {
                    backgroundColor:'#376b9f',
                    borderRight : '1px solid white',
                }
            case length-1:
                return {}
            default:
                return {borderRight : '1px solid white',}
        }
    }
    else {
        switch(idx) {
            case 0:
                return {borderRight : '1px solid white',}
            case length-1:
                return {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                }
            default:
                return {
                    backgroundColor:'#eee',
                    textAlign:'center',
                    color:'#000',
                    borderRight : '1px solid white',
                }
        }
    }
}

const CustomTable = (props) => {
    const {columnHead, rowHead, record, stat, changeEvent = ()=>{}, onSubmit = () =>{}} = props
    const classes = useStyles(); 

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
                        className={classes.inputCell}
                        onChange={ ev => changeEvent(id, idx, ev.target.value)}/>
            case 'show':
            default :
            return value
        }
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
                            style={getStyle(idx, columnCount, true)}
                            children={column}/>
                    )}
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    rowData.map((row, idx) => 
                        <TableRow key={idx}>
                            {columnData.map((data, idx2) => 
                                <TableCell 
                                    component="th" scope="row" 
                                    className={classes.headCell}
                                    style={getStyle(idx2, columnCount)}
                                    key={idx2}
                                    children={displayCell(idx, idx2, row[idx2])}/>)
                            }
                        </TableRow>
                    )
                }
                </TableBody>
                </Table>
            </TableContainer>
            {(stat === 'update-time') ? 
                <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.submit}
                    onClick={()=>onSubmit(rowData)}>Submit</Button> : null
            }
        </div>
    )
}

export default CustomTable
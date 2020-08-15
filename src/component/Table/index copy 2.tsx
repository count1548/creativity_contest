import React, {useState, useEffect } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

import NoData from './NoData'
import Button from '@material-ui/core/Button'

const createStyle = (headWidth, columnLen, maxHeight = null) => {
    return {
            tablePaper: {
                width:'100%',
                margin : '0 auto',
                borderRadius: '15px',
                fontFamily:'NanumSquareRoundR',
                testAlign:'center',
                maxHeight:maxHeight,
                WebkitScrollbar : { display:'none' }
            },

            headCell : {
                color : '#fff',
                wordBreak : 'keep-all',
                backgroundColor : '#2c537a',
            },

            basicCell : {
                borderRight: '1px solid white'
            },

            tableHead : {
                backgroundColor : '#376b9f',
                width : `${headWidth}%`,
            },
            columnCell : {
                width : `${(100-headWidth)/(columnLen - 1)}%`
            },
            rowCell : {
                color : '#000',
                textAlign:'center',
                backgroundColor : '#eee',
            },
            selectedRowHeadCell : { backgroundColor : '#A1537A', },
            selectedRowCell : { backgroundColor : '#EEB8EE', },
            lastCell : { borderRight:'0' },
            button : {
                display : 'block',
                margin : '10px auto'
            }
        }
}


const equals = (obj, target) => {
    if((obj['row'] === target['row']) &&
        (obj['column'] === target['column'])) return true
    return false
}

const CustomTable = (props) => {
    const { column, rowHead, record, isrowHead=true, headWidth = 10,
            onClick = (idx) => {}, onSelected = (idx) => {}, 
            onChange = ()=>{}, onSubmit = () => {},
            style=null, editable=false, selectable = false, button=null, 
            selecteCount = record.length, maxHeight = null } = props
    
    const [selectList, setSelecte] = useState<number[]>([]) //case - selectable true
    useEffect(()=>setSelecte([]), [])
    
    if(column.length === 0 || record.length === 0) return <NoData message='Please Select Options' />
    
    const changeList:Object[] = []                  //case - editable true 
    const rowData = (!isrowHead) ? record :
        rowHead.map((data, idx) => [data].concat(record[idx]))
    const columnData:string[] = column
    const length = columnData.length

    const styles = {...createStyle(headWidth, length, maxHeight), ...style}
    const Cell = (row, column, value) => {
        if(editable && column !== 0) 
            return <TextField
                id={`${row}-${column}`}
                defaultValue={value} type='time'
                onChange={ ev => {
                    const changeval = ev.target.value
                    record[row][column -1] = changeval //실제 보이는 데이터 변경

                    const chObject = {
                        row : row,
                        column : column - 1,
                        value : changeval
                    }

                    const key = changeList.find(data => equals(chObject, data))
                    if(typeof(key) === 'undefined')
                        changeList.push(chObject)
                    else key['value'] = changeval
                    
                    onChange(row, column-1, changeval)
                }}/>
        return value
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
                onClick = ()=>onSubmit(selectList)
                break
            default:
                return null
        }
        return (
            <Button 
                variant="contained" 
                color={color} 
                style={styles.button}
                onClick={onClick}>{msg}</Button>
        )
    }

    const clickHandle = (_idx:number) => {
        if(selectable) {
            const temp = selectList.slice()
            const alreadyIdx = temp.indexOf(_idx)

            if(alreadyIdx !== -1) temp.splice(alreadyIdx, 1)
            else {
                if(selectList.length >= selecteCount) temp.shift()
                temp.push(_idx)
            }
            setSelecte(temp)
            onSelected(_idx)
        }
        onClick(_idx)
    }
    const getStyle = (column, row) => {
        let cellStyle:Object
        if(column === -1) {  //column head
            cellStyle = {...styles.headCell, ...(row === 0) ? styles.tableHead : styles.columnCell}
        }
        else {
            cellStyle = {...(isrowHead && (row === 0)) ? styles.headCell : styles.rowCell }
            if(selectList.indexOf(column) !== -1) 
                cellStyle = {...cellStyle, ...(isrowHead && (row === 0)) ? styles.selectedRowHeadCell: styles.selectedRowCell}
            
        }
        return cellStyle
    }
    
    const component = <div>
        <TableContainer component={Paper} style={styles.tablePaper}>
            <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                {columnData.map((column, idx) =>    //Table Column 
                    <TableCell 
                        key={idx} align='center'
                        style={getStyle(-1, idx)}
                        children={column}/>
                )}
                </TableRow>
            </TableHead>
            <TableBody>
            {
                rowData.map((row, idx) =>           //Table Data (rows)
                    <TableRow key={idx} 
                        onClick={()=>clickHandle(idx)}>
                        {columnData.map((data, idx2) => 
                            <TableCell 
                                component="th" scope="row" 
                                style={getStyle(idx, idx2)}
                                key={idx2}
                                children={Cell(idx, idx2, row[idx2])}/>)
                        }
                    </TableRow>)
            }
            </TableBody>
            </Table>
        </TableContainer>
        {getButton()}
    </div>

    return component
}

export default CustomTable
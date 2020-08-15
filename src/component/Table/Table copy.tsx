import React from 'react';
import MaterialTable from 'material-table';

const createHead = (name : string, label : string, first : boolean = false) => {
    return ({
        title : label, 
        field : name, 
        sorting: false,
        cellStyle : {
            backgroundColor : (first) ? '#2c537a' : "#eee",
            color : (first) ? '#FFF' : '#000',
            border:'1px solid #000'
        },
        headerStyle: {
            backgroundColor:  (first) ? '#01579b' : '#2c537a',
            color : '#FFF'
        }
        //editable : !first
    })
}

const Table = (props) => {
    const {columnHead, rowHead, record} = props
    
    const rowData = rowHead.map((data, idx) => ({...data, ...record[idx]}))
    const columnData = Object.keys(columnHead).map((key, idx) => createHead(key, columnHead[key], (idx == 0)))
    console.log(rowData, columnHead)

    return (
        <MaterialTable
            style={{ boxShadow:'none' }}
            title="시간표"
            columns={columnData}
            data={rowData}
            options={{
                searchFieldStyle : {
                  display:'none',
                },
                paging : false,
        }}/>
    )
}

export default Table
export {createHead}
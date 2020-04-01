import { DataGrid, ToolbarOptions } from 'tubular-react';
import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import localData, {data_format} from '../database';  //database 

interface propsType {
    title : string
    columns : any
    push : (path:string) => void
}

const node = (props:propsType) => (
    <IconButton color="default"
        aria-label="add"
        onClick={() => {
            props.push(`/new_notice/${localData[localData.length-1].id+1}`);
        }}>
        <AddIcon /> 
    </IconButton>
);

const Table = (props:propsType) => {
    const toolbarOptions = new ToolbarOptions({
        advancePagination: true,
        bottomPager: true,
        exportButton: true,
        printButton: true, 
        customItems: node(props),
        searchText: true,
        topPager: true
    });
    const [data, setState] = useState<data_format[] | null>(null);
    useEffect(() => {
        fetch('http://192.168.198.128:3001/getList/', {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => setState(responseData))
        .catch((error)=>{ console.log('Error fetching ',error); });
    }, [])
    return (
        data!=null ? 
            <DataGrid columns={props.columns} 
                gridName="Grid" 
                dataSource={data}
                onRowClick={(row : data_format) => {
                    props.push(`/view_notice/${row.id}`);
                }}
                toolbarOptions={toolbarOptions}
                >
            </DataGrid>
            :<div>데이터 로딩중...</div>
)};

export default Table;
import { DataGrid, ToolbarOptions } from 'tubular-react';
import React, { useState, useEffect } from 'react';
import MaterialTable, { Column } from 'material-table';

import localData, {data_format} from '../database';  //database 
import {getData, setData, updateData, deleteData} from '../../data_function';
interface propsType {
    title : string
    columns : any
    source : any
    onClick : () => void
    onDataChange : (obj : any) => void
    children : any
}

interface state { data : any[] }

const Table = (props:propsType) => {
    const [state, setState] = useState({data : props.source})
    return (
        <div>
            {props.children}
            {state.data!=null ? 
                <MaterialTable 
                    title = {props.title}
                    columns={props.columns}
                    data={state.data}
                    onRowClick={(e, data) => props.onClick() }
                    editable={{
                        onRowAdd: (newData) => {
                            setData(newData, 'bbs')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('bbs', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                        onRowUpdate: (newData, oldData) => {
                            updateData(newData, 'bbs')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('bbs', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                        onRowDelete: (oldData) => {
                            deleteData(oldData['id'], 'bbs')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('bbs', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                    }}/>
                :<div>Data not exist...</div>}
        </div>
)};

export default Table;
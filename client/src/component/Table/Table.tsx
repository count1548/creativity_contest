import { DataGrid, ToolbarOptions } from 'tubular-react';
import React, { useState, useEffect } from 'react';
import MaterialTable, { Column } from 'material-table';

import localData, {data_format} from '../database';  //database 

interface propsType {
    title : string
    columns : any
    source : any
    onClick : () => void
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
                        onRowAdd: (newData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    setState((prevState) => {
                                        const data = [...prevState.data];
                                        data.push(newData);
                                        return { ...prevState, data };
                                    });
                                    }, 600);
                            }),
                            onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        setState((prevState) => {
                                        const data = [...prevState.data];
                                        data[data.indexOf(oldData)] = newData;
                                        return { ...prevState, data };
                                        });
                                    }
                                    }, 600);
                            }),
                            onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    setState((prevState) => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        return { ...prevState, data };
                                    });
                                    }, 600);
                                }),
                        }}/>
                :<div>Data not exist...</div>}
        </div>
)};

export default Table;
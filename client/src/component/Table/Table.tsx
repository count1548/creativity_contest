import React from 'react';
import MaterialTable from 'material-table';

import {getData, setData, updateData, deleteData} from '../../data_function';
interface propsType {
    title : string
    columns : any
    source : any
    onClick : (row : any) => void
    onDataChange : (obj : any) => void
    children : any
}

interface state { data : any[] }

const Table = (props:propsType) => {
    return (
        <div>
            {props.children}
            {props.source!=null ? 
                <MaterialTable 
                    title = {props.title}
                    columns={props.columns}
                    data={props.source}
                    onRowClick={(e, data) => props.onClick(data) }
                    editable={{
                        onRowAdd: (newData) => {
                            setData(newData, 'busLine')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('busLine', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                        onRowUpdate: (newData, oldData) => {
                            updateData(newData, 'busLine')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('busLine', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                        onRowDelete: (oldData) => {
                            deleteData(oldData['id'], 'busLine')
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    getData('busLine', props.onDataChange)
                                    resolve();
                                }, 600);
                        })},
                    }}/>
                :<div>Data not exist...</div>}
        </div>
)};

export default Table;
import React from 'react';
import MaterialTable from 'material-table';

interface propsType {
    title? : string
    columns : any
    source : any
    defaultEdit : object,
    action? : any,
    children? : any,
    options? : any,
    onRowClick? : any,
    style? : any,
}

interface state { data : any[] }

const Table = (props:propsType) => {
    const {style, children, source, title, columns, action, defaultEdit, options, onRowClick} = props
    const propsData = {
        'title' : title,
        'columns' : columns,
        'data' : source,
        'actions' : action,
        'editable' : defaultEdit,
        'options' : options,
        'onRowClick' : onRowClick,
        'style' : style
    }
    return (
        <div>
            {children}
            {source!=null ? 
                <MaterialTable 
                    {...propsData}/>
                :<div>Data not exist...</div>}
        </div>
)};

export default Table;
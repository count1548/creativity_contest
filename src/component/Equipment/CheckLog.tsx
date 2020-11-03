/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import { equip_data, check_log } from '../../dataset'

const result_color = ['green', 'yellow', 'red']
const max_success = 6

const columns = [
    { title: 'ID', field: 'ID', hidden:true },
    { title: '장비', field: 'equip_ID', render : rowData => (rowData['equip_ID'] + '번 장비')},
    { title: '점검결과', field: 'check_res', width : 100, render : rowData => {
        const idx = (max_success - rowData['check_res'].length) / 2
        const color = result_color[parseInt(idx.toString())]
        return (
            <div style={{
                width : '20px', height : '20px',
                borderRadius : '50%', backgroundColor : color,
            }}></div> 
        )
    }},
    { title: '점검시간', field: 'date', width:170},
    { title: '책임자', field: 'user', },
]

const CheckLog = props => {
    const {title = true, filtering = true, search = true, paging = true, id = null, size = 10} = props
    const data = (id !== null) ? check_log.slice(0, size) : check_log
    
    return <MaterialTable
        columns = {columns}
        data={data}
        options = {{
            filtering : filtering,
            search : search,
            paging : paging,
            pageSize : size,
            toolbar : title,
        }}
    />
}

export default CheckLog;

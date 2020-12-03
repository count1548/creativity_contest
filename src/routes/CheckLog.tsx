/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import Loading from '@material-ui/core/CircularProgress';
import { isAvailable, getAPI, setAPI, getAPI_local } from '../data_function'

const result_color = ['green', 'yellow', 'red']
const max_success = 6

const columns = [
    { title: 'ID', field: 'id', hidden:true },
    { title: '장비', field: 'equip_id', width:120, render : rowData => (rowData['equip_id'] + '번 장비')},
    { title: '점검결과', field: 'check_res', width : 115, render : rowData => {
        const idx = (max_success - rowData['check_res'].length) / 2
        const color = result_color[parseInt(idx.toString())]
        return (
            <div style={{
                width : '20px', height : '20px',
                borderRadius : '50%', backgroundColor : color,
            }}></div> 
        )
    }, filtering : false as const,},
    { title: '점검시간', field: 'date', width:150, type:'date' as const},
    { title: '책임자', field: 'user', },
]
async function getData() {
    const check_log = await getAPI('/equip/check/all') 
    if (!isAvailable(check_log)) return {check_log :[]}
    return { check_log }
}
let check_log:any[]

const CheckLog = props => {
    const {
        title = true, filtering = true, 
        search = true, paging = true, 
        id = null, size = 10, hiddenNumber = false,
        data = null
    } = props
    const [stat, setState] = useState(data === null ? 'apply' : 'show')
    const [updated, setUpdated] = useState(true)
    columns[1]['hidden'] = hiddenNumber

    useEffect(() => {
      if(id === null && data === null) getData().then(res => {
        ({check_log} = res)
        setState('show')
      })
    }, [updated])
    if (stat === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>

    return <MaterialTable
        columns = {columns}
        data={(id !== null) ? data.slice(0, size) : check_log}
        title={'점검기록'}
        options = {{
            filtering : filtering,
            search : search,
            paging : paging,
            pageSize : size,
            toolbar : title,
            headerStyle: {
                backgroundColor: '#20876F',
                color: '#FFF'
            }
        }}
    />
}

export default CheckLog;

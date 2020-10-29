import React, {useState, useEffect}  from "react"
import * as Data from '../data_function'
import Table from 'material-table'
import Tooltip from '../component/Tooltip/Tooltip'
import SeatLayout from '../component/Tooltip/SeatLayout'
import NoData from '../component/Table/NoData'
import Notice from '../component/Notice'
import Loading from '@material-ui/core/CircularProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import Icon from '@material-ui/core/Icon'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import dateFormat from 'dateformat'
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI, setTimeTable} from '../data_function'

const columns = [
    {title : '번호', field : 'IDX', width:90, },
    {title : '제목', field : 'TITLE' },
    {title : '내용', field : 'CONTENT', 
        render : rowData => {
            return <div style={{
                whiteSpace:'nowrap',
                overflow:'hidden',
                textOverflow:'ellipsis',
                width:'500px'
            }}>{rowData['CONTENT']}</div>
        }
    },
    {title : '시간', field : 'TIME', 
        render : rowData => {
            const date = new Date(rowData['TIME'])
            return dateFormat(date, 'mm.dd hh:MM')
    }},
    {title : '파일', field : 'FILE', 
        render : rowData =>
            rowData['FILE'] ? <AttachFileIcon/> : null
        },
]

async function getData() {
    return await getAPI('notice/list/', 'notice', 4000)
}

const NoticeList = props => {
    const [notices, setNotices] = useState<object[] | null>(null)
    const [notice, setNotice] = useState<object | null>(null)
    const [state, setState] = useState('show')
    const [updated, setUpdated] = useState(true)

    useEffect(() => {
        getData().then(res => {
            setNotices(res)
            setState('show')
        }).catch(err => console.log(err))
    }, [updated])

    if (state === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
    
    const defaultEdit = {
        onRowDelete : oldData => {
            //Data.updateData({}, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 600)
        })},
    }

    const rowClickHandle = (ev, data) => {
        setNotice(data)
        setState('show-notice')
    }

    const displayComponent = () => {
        if(notices === null) return <NoData message='Please Select Options' />
        switch(state) {
            case 'show':
                return <Table
                    title="공지 목록"
                    data={notices}
                    editable = {defaultEdit}
                    columns={columns}
                    options={{
                        rowStyle: { backgroundColor: '#EEE', },
                        actionsColumnIndex: -1,
                        pageSize: 10
                    }} onRowClick = {rowClickHandle}/>
            case 'show-notice':
                return <Notice/>
        }
    }

    return displayComponent()
}

export default NoticeList 

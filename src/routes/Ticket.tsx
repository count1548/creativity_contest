import React, {useState, useEffect}  from "react";
import * as Data from '../data_function';
import Table from 'material-table';
import Tooltip from '../component/Tooltip/Tooltip';
import SeatLayout from '../component/Tooltip/SeatLayout';

import CircularProgress from '@material-ui/core/CircularProgress';

const columns = [
    {title : 'ID', field : 'TICKET_ID', hidden : true, width:0 },
    {title : '학생', field : 'STUDENT_ID', width:100 },
    {title : '노선', field : 'BUS_ID', defaultGroupOrder: 0, width:0  },
    {title : '출발지', field : 'START' },
    {title : '도착지', field : 'END' },
    {title : '예약 날짜', field : 'RESERVATION_DATE', width:150, type:"date" as const, },
    {title : '출발 날짜', field : 'TICKET_DATE', width:150, type:"date" as const, },
    {title : '출발 시간', field : 'TICKET_TIME', width:150, },
    {title : '좌석', field : 'SEAT', width:100, 
        render : rowData =>
            <Tooltip text = {<SeatLayout num = {rowData['SEAT']}/>}>
                <div style={{
                    'textAlign' : 'center',
                    'backgroundColor' : '#aaa',
                    'borderRadius' : '5px',
                    'padding' : '10px 0',
                    'cursor' : 'default',
                }}>{rowData['SEAT']}</div>
            </Tooltip>
    },
    {title : '탑승', field : 'BOARDING', width:100, 
        lookup: { '탑승' : '탑승', '미탑승' : '미탑승' },
        render: rowData => 
            <div style={{
                'width' : '30px',
                'height' : '30px',
                'borderRadius' : '50%', 
                'backgroundColor' : (rowData['BOARDING'] === '미탑승') ? 'red' : 'green',
                'margin' : '0 auto'
            }}></div>
    },
    {title : '결재금액', field : 'PRICE', width:180, filtering: false },
]

const TicketList = props => {
    const [tickets, setTickets] = useState<object[] | null>(null)
    const defaultEdit = {
        onRowDelete : oldData => {
            //Data.updateData({}, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getAPI('ticket/lists/all/', 'TICKET', setTickets)
                    resolve();
                }, 600);
        })},
    }

    useEffect(() => {
        Data.getAPI('ticket/lists/all/', 'TICKET', data => {
            data = data.map(value => {
                const time = value['TICKET_TIME'].split(':')
                const temp = {
                    ...value,
                    'TICKET_DATE' : value['TICKET_DATE'].split('T')[0],
                    'RESERVATION_DATE' : value['RESERVATION_DATE'].split('T')[0],
                    'TICKET_TIME' : `${time[0]}:${time[1]}`
                }
                return temp
            })
            setTickets(data)
        })
    }, [])
    return (
        tickets === null ? <div style={{width:'300px', margin:'30px auto'}}><CircularProgress size={200}/></div> :
        <Table
            title="티켓 목록"
            data={tickets}
            editable = {defaultEdit}
            columns={columns}
            options={{
                filtering: true,
                grouping: true,
                rowStyle: { 
                    backgroundColor: '#EEE', 
                },
                selection:true,
                actionsColumnIndex: -1,
                pageSize: 10
            }}
            actions={[{
                tooltip: 'Remove All Selected Users',
                icon: 'delete',
                onClick: (evt, data:any[]) => alert('You want to delete ' + data.length + ' rows')
            }]}
        />
    )
}

export default TicketList 

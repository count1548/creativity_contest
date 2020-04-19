import React, {useState, useEffect}  from "react";
import * as Data from '../data_function';
import Table from 'material-table';
import Tooltip from '../component/Tooltip/Tooltip';
import SeatLayout from '../component/Tooltip/SeatLayout';

const columns = [
    {title : 'ID', field : 'TICKET_ID', hidden : true, width:0 },
    {title : '학생', field : 'STUDENT_ID' },
    {title : '버스', field : 'BUS_ID', defaultGroupOrder: 0 },
    {title : '출발지', field : 'START' },
    {title : '도착지', field : 'END' },
    {title : '출발 날짜', field : 'TICKET_DATE' },
    {title : '출발 시간', field : 'TICKET_TIME' },
    {title : '예약 날짜', field : 'RESERVATION_DATE' },
    {title : '좌석', field : 'SEAT', width:100, 
        render : rowData => 
            <Tooltip text = {<SeatLayout num = {rowData['SEAT']}/>}>
                <div>{rowData['SEAT']}</div>
            </Tooltip>
    },
    {title : '탑승여부', field : 'BOARDING',
        render: rowData => 
            <div style={{
                'width' : '30px',
                'height' : '30px',
                'borderRadius' : '50%', 
                'backgroundColor' : (rowData['BOARDING'] === '미탑승') ? 'red' : 'green'
            }}></div>
    },
]

const TicketList = props => {
    const [tickets, setTickets] = useState<object[] | null>(null)
    const defaultEdit = {
        onRowAdd: newData => {
            //Data.setData({}, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('TICKETS', setTickets) 
                    resolve();
                }, 600);
        })},
        onRowUpdate : newData => {
            //Data.updateData({}, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('TICKETS', setTickets)
                    resolve();
                }, 600);
        })},
    }

    useEffect(() => {
        Data.getData('TICKETS', data => {
            data = data.map(value => {
                value['TICKET_DATE'] = value['TICKET_DATE'].split('T')[0]
                value['RESERVATION_DATE'] = value['RESERVATION_DATE'].split('T')[0]
                return value
            })
            setTickets(data)
        })
    }, [])

    if(tickets !== null) {
    }

    return (
        tickets === null ? <div>Loading...</div>:
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
            }}
        />
    )
}

export default TicketList 
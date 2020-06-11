import React, {useState, useEffect}  from "react";
import * as Data from '../data_function';
import Table from 'material-table';
import Tooltip from '../component/Tooltip/Tooltip';
import SeatLayout from '../component/Tooltip/SeatLayout';

const columns = [
    {title : 'ID', field : 'TICKET_ID', hidden : true, width:0 },
    {title : '학생', field : 'STUDENT_ID', width:100 },
    {title : '버스', field : 'BUS_ID', defaultGroupOrder: 0, width:0  },
    {title : '출발지', field : 'START' },
    {title : '도착지', field : 'END' },
    {title : '예약 날짜', field : 'RESERVATION_DATE', width:150 },
    {title : '출발 날짜', field : 'TICKET_DATE', width:150  },
    {title : '출발 시간', field : 'TICKET_TIME', width:150 },
    {title : '좌석', field : 'SEAT', width:100, 
        render : rowData => 
            <Tooltip text = {<SeatLayout num = {rowData['SEAT']}/>}>
                <div>{rowData['SEAT']}</div>
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
            components={{
                GroupRow: rowData => 
                    <div style={{
                        width : '100%',
                        height : '30px',
                        backgroundColor: 'black'
                    }}></div>
              }}
        />
    )
}

export default TicketList 

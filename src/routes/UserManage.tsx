import React, {useState, useEffect} from "react"
import NoData from '../component/Table/NoData'
import SearchBox from '../component/Search'
import {isAvailable, getAPI, setAPI} from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Loading from '@material-ui/core/CircularProgress'
import Container from '../component/Container'
import TextLabel from '../component/Container/TextLabel'
import {dictToArr} from '../data_function'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Table from '../component/Table/SimpleTable'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainContent : {
            width : 'clac(100% - 60px)',
            padding : '30px',
            borderRadius : '5px',
            background : '#ccc',
            '&:after' : {
                content : '\' \'',
                display : 'block',
                clear : 'both'
            }
        },
        divider: {
            margin:'60px auto'
        },
        button : {
            display:'block',
            margin:'10px auto'
        },
    }),
)

async function getData() {
    // const infoData = await getAPI('student/info/', 'result')
    // const penaltyData = await getAPI('student/penalty/', 'result')
    // const ticketCount = await getAPI('student/ticket/count', 'result')
    // const ticketCount = await getAPI('student/qr/count', 'result')
    // if( !isAvailable(infoData) || 
    //     !isAvailable(penaltyData))
    //     return {
    //         infoData : {}, 
    //         penaltyData : {},
    //     }
    
    // return { infoData, penaltyData }

    const students = [
        {
            STUDENT_ID : '080024',
            STUDENT_NAME : '박차식',
            STUDENT_DERT : '기계자동차공학부',
            STUDENT_SCHYR : '0',
            ACCEPT : '동의',
            PENALTY_COUNT : '0',
            PENALTY_DATE : null,
            PENALTY_END : null,
            PHONE : null,
            ADDRESS : null,

        }, {
            STUDENT_ID : '080033',
            STUDENT_NAME : '박승규',
            STUDENT_DERT : '화학공학과',
            STUDENT_SCHYR : '0',
            ACCEPT : '동의',
            PENALTY_COUNT : '0',
            PENALTY_DATE : 'Mon Jul 13 2020 21:00:00 GMT+0900 (GMT+09:00)',
            PENALTY_END : 'Tue Jul 14 2020 21:00:00 GMT+0900 (GMT+09:00)',
            PHONE : null,
            ADDRESS : null,
        },
    ]

    const penalties = [
        {
            IDX : 0,
            STUDENT_ID : '080024',
            TICKET_ID : '9',
        },
        {
            IDX : 1,
            STUDENT_ID : '080024',
            TICKET_ID : '16',
        }
    ]

    const tickets = await getAPI('ticket/lists/all/', 'TICKET')

    const ticketData = dictToArr(tickets, 'TICKET_ID', null, false)
    const studentData = dictToArr(students, 'STUDENT_ID', null, false)
    const penaltyData = dictToArr(penalties, 'STUDENT_ID', null, true)


    return {ticketData, studentData, penaltyData}
}

const findTicket = (value, id) => value['TICKET_ID'] == id

const getSelectedData = (data:Object, ID:string) => {
    if( !isAvailable(data)  || 
        !isAvailable(ID) ) return null
    if(!isAvailable(data['student'])) return null
    const penaltyTicket = isAvailable(data['penalty']) ? 
        data['penalty'].map(value => data['tickets'][value['TICKET_ID']]) : []
        
    return {
        ...data['student'],
        penaltyData : penaltyTicket,
    }
}

let ticketData:Object = {}, 
    studentData:Object = {}, 
    penaltyData:Object = {}
const columns = [{
        title : '가격',
        field : 'PRICE',
        width : 90
    }, {
        title : '출발',
        field : 'START',
        width : 120
    }, {
        title : '예약 시간',
        field : 'RESERVATION_DATE',
}]

const PenaltyList = (props) => {
    const [student, setStudent] = useState<string>('')
    const [stdPenalty, setPenalty] = useState<Object | null>(null)
    const [state, setState] = useState('apply')

    const classes = useStyles()
    useEffect(() => {
        getData().then(res => {
            ({studentData, penaltyData, ticketData} = res)
            setState('show')
        })
    }, [])

    if(state === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>

    const selectedData:Object|null = 
        getSelectedData({
            student : studentData[student],
            penalty : penaltyData[student],
            tickets : ticketData
        }, student)
   
    return (
        <div>
            <SearchBox
                onSearch={value => setStudent(value)}
            />
            <Divider className={classes.divider}/>
            {(selectedData === null) ? 
            <NoData message='Please Input Student ID' /> : 
            <div className={classes.mainContent}>
                <Container 
                    title={'학생정보'}
                    width={'45%'}
                    align={'left'} >
                    <div>
                        <TextLabel label={'학번'}>{student}</TextLabel>
                        <TextLabel label={'이름'}>{selectedData['STUDENT_NAME']}</TextLabel>
                    </div>
                    <TextLabel label={'소속학과'}>{selectedData['STUDENT_DERT']}</TextLabel>
                    <TextLabel label={'개인정보 동의여부'}>{selectedData['ACCEPT']}</TextLabel>
                    <TextLabel label={'전화번호'}>{selectedData['PHONE']}</TextLabel>
                    <TextLabel label={'주소'}>{selectedData['ADDRESS']}</TextLabel>
                    <Divider className={classes.divider} style={{margin:'10px auto'}}/>
                    <TextLabel label={'페널티 횟수'}>{
                        (isAvailable(penaltyData[student])) ? 
                        penaltyData[student].length : 0}</TextLabel>
                    {/* <TextLabel label={'통학 예약 횟수'}>{selectedData['BUS_COUNT']}</TextLabel>
                    <TextLabel label={'셔틀 탑승 횟수'}>{selectedData['SHUTTLE_COUNT']}</TextLabel> */}
                </Container>

                <Container 
                    title={'패널티내역'}
                    width={'45%'}
                    align={'right'} >
                    <Table
                        columns = {columns}
                        data = {selectedData['penaltyData']}/>
                    <Button 
                        variant="outlined" 
                        color='primary' 
                        onClick={()=>{}}
                        className={classes.button}>선택삭제</Button>
                </Container>
                
            </div>}
        </div>
    )
}
export default PenaltyList

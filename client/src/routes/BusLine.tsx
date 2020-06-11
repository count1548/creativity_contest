import React, {useState, useEffect}  from "react";
//import Table from "../component/Table/Table";
import Table from 'material-table';
import columns from '../component/Table/columns';
import TransferList from '../component/LineList/TransferList';
import * as Data from '../data_function';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  }),
);

interface columnFormat {
    id : number,
    name : string
}
const dictToArr = (dict:any[]) => {
    let column = {}
    dict.map(data => column[data.id] = data.name)
    return column
}

let columnsData, allLine, selectedID : number
let displayData:any[] = [], busLine:number[] = []

const Notice = props => {
    const [data, setState] = useState<any | null>(null)
    const [column, setColumns] = useState<string [] | null>(null)
    const [open, setOpen] = useState(false)
    const classes = useStyles();    
    
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const rowChange = rowData => {
        selectedID = rowData['id']
        var selectedData = data[rowData['idx']]
        busLine = selectedData['path'].split(',')
            .map((value:number) => value*1)
        busLine.push(selectedData['terminus']*1)
        busLine.unshift(selectedData['start']*1)
        handleOpen()
    }

    const defaultEdit = {
        onRowAdd: newData => {
            Data.setData(newData, 'busLine')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('busLine', _data => {
                        setState(_data)
                        selectedID = _data[_data.length-1]['id']
                        handleOpen()
                    })
                    
                    resolve();
                }, 600);
        })},
        onRowDelete : oldData => {
            Data.deleteData(oldData['id'], 'busLine')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('busLine', setState)
                    resolve();
                }, 600);
        })}
    }
    useEffect(() => {
        Data.getData('busLine', _data => {
            Data.getData('LineList', lineData => {
                setColumns(lineData)
                setState(_data)
            })
        })
    }, [])

    if(data != null && column != null) {
        columnsData = dictToArr(column)
        allLine = Object.keys(columnsData).map((value:any) => value*1)
 
        displayData = data.map((item, idx) => {
            var path = Data.stringToArr(item['path'], ',')
            return {
                ...item,
                'idx' : idx,
                'start' : columnsData[item['start']*1],
                'terminus' : columnsData[item['terminus']*1],
                'path' : path.map((value:any) => 
                    columnsData[value*1]).join(' - ')
            }
        })
    }
    return (
        data == null || column == null ? <div>Loading...</div> :
        <div>
            <Table title = "Bus Line"
            data = {displayData}
            columns = {columns}
            editable = {defaultEdit}
            actions = {[{
                icon: 'update',
                tooltip: 'change busline',
                onClick: (e, data) => rowChange(data)
            }]}
            onRowClick = {(e, value) =>  props.history.push(`/timetable/${value.id}`) }
            options = {{
                rowStyle: {
                  backgroundColor: '#EEE',
                }, grouping:true,
            }}/>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,}}>
                <Grow in={open}>
                    <TransferList 
                        data = {columnsData}
                        title = {'현 정류장'}
                        chData = {busLine}
                        allData = {allLine}
                        onSubmit = {applyData => {
                            var _data = {
                                'id' : selectedID,
                                'start' : applyData.shift(),
                                'terminus' : applyData.pop(),
                                'path' : Data.arrToString(applyData, ',')
                            }
                            Data.updateData(_data, 'busLine', ()=>{ 
                                Data.getData('busLine', res => {
                                    setState(res)
                                    handleClose()
                                })                                
                            })
                    }}/>
                </Grow>
            </Modal>
        </div>
    )
}

export default Notice;

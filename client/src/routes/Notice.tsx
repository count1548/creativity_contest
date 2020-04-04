import React, {useState, useEffect}  from "react";
//import Table from "../component/Table/Table";
import Table from "../component/Table/Table";
import columns from '../component/Table/columns';
import TransferList from '../component/LineList/TransferList';
import {getData} from '../data_function';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

interface IParentProps{//props타입 선언
    tableTitle:string
    path:string
    history : { push : (path:string) => void }
}
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
    dict.map((data, idx) => column[data.id] = data.name)
    return column
}
let columnsData, choice:number[] = [], all

const Notice = (props:IParentProps) => {
    const [data, setState] = useState<any | null>(null)
    const [column, setColumns] = useState<string [] | null>(null)
    const [busLine, setLine] = useState()
    const [open, setOpen] = useState(false)
    const classes = useStyles();

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const rowClick = (rowData) => {
        var data = rowData['pathIdx'].split(',').map((value:any) => value*1)
        data.pop()
        setLine(data)
        handleOpen()
    }
    useEffect(() => {
        getData('busLine', _data => {
            getData('LineList', lineData => {
                setColumns(lineData)
                
                columnsData = dictToArr(lineData)
                all = Object.keys(columnsData).map((value:any) => value*1)
                _data.map((item, idx) => {
                    var path = item['path'].split(',')
                    item['pathIdx'] = item['path']
                    item['path'] = ''
                    choice = []

                    path.map((value, idx) => {
                        if(value !== '') {
                            choice.push(value*1)
                            item['path'] += ` - ${columnsData[value*1]}`
                        }
                    })
                    item['path'] = item['path'].replace('-', '')
                    item['start'] = columnsData[item['start']*1]
                    item['terminus'] = columnsData[item['terminus']*1]
                })
                setState(_data)
            })
        })
    }, [])
    return (
        data == null || column == null ? <div>Loading...</div> :
        <Table title = "Bus Stop"
            columns = {columns}
            onClick = {rowClick}
            source = {data}
            onDataChange = {setState}>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,}}>
                <Fade in={open}>
                    <div className={classes.paper}>
                        <TransferList 
                            dataString = {columnsData}
                            title = {'현 정류장'}
                            chData = {busLine}
                            allData = {all}/>
                    </div>
                </Fade>
            </Modal>
        </Table>
    )
}

export default Notice;

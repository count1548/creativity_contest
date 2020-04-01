import React, {useState, useEffect}  from "react";
//import Table from "../component/Table/Table";
import Table from "../component/Table/Table";
import columns from '../component/Table/columns';
import TransferList from '../component/LineList/TransferList';
import localData, {data_format} from '../component/database';

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

const Notice = (props:IParentProps) => {
    const [data, setState] = useState<any | null>(null)
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    useEffect(() => {
        fetch('http://192.168.198.128:3001/getList/', {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => setState(responseData))
        .catch((error)=>{ console.log('Error fetching ',error); });
    }, [])
    return (
        data == null ? <div>Loading...</div> :
        <Table title = "Bus Stop"
            columns = {columns}
            onClick = {() => handleOpen()}
            source = {data}>
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
                    <div className={classes.paper}><TransferList/></div>
                </Fade>
            </Modal>
        </Table>
    )
}

export default Notice;

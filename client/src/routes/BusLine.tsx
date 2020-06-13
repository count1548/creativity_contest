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
import axios from 'axios'
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

const dictToArr = (dict:any[]) => {
    let column = {}
    dict.map(data => column[data.id] = data.name)
    return column
}
const url = 'https://hub.hsu.ac.kr/bus'
const Notice = props => {
    const [stop, setStop] = useState<any[] | null>(null)
    const [line, setline] = useState<any[] | null>(null)

    const [open, setOpen] = useState(false)
    const classes = useStyles();
    
    const dataSet = () => {
        const res = axios.get(`${url}/stop`)
        console.log(res)
    }
    useEffect(()=> {
        dataSet()
    }, [])
    return (
        <div>
           test
        </div>
    )
}

export default Notice;

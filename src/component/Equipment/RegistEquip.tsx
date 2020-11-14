/*eslint-disable */
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { getAPI, isAvailable } from "../../data_function"
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import InnerMap from '../Tooltip/InnerMap'
import Dialog from '../Dialog'

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'800px',
    },
    inputForm : {
        '& > div' : {
            marginBottom:'10px'
        },
        float:'left'
    },
    innerMap : {
        border:'1px solid gray',
        float:'right'
    }
}));
let serial:string

const RegistEquip = props => {
    const { map_info, onSubmit, onClose, open_p } = props
    const classes = useStyles()
    const [check, setCheck] = useState(1)
    const [building, setBuilding] = useState(-1)
    const [location, setLocation] = useState<null | {x : number, y : number }>(null)
    const [open, setOpen] = useState(false)

    useEffect(()=> setOpen(open_p) , [open_p])


    return (
    <Dialog
        submitMsg = {'등록'}
        resetMsg = {'취소'}
        type={'component'}
        title={'장비등록'}
        onSubmit={()=> {
            if(typeof(serial) === 'undefined' || serial === '' || building === -1) return false
            onSubmit({
                serial : serial,
                location_name : map_info[building]['name'],
                location : location
            })
            return true
        }}
        onClose={onClose}
        defaultState={open}
        >
        <div className={classes.container}>
            <div className={classes.inputForm}>
                <div><TextField id="serial" label="Serial Number" variant="outlined" onChange={
                    ev => {serial = ev.target.value}
                }/></div>

                <div><FormControl variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">점검여부</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={check}
                        onChange={ev=>setCheck(ev.target.value as number)}
                        label="Age" >
                    <MenuItem value={1}>점검</MenuItem>
                    <MenuItem value={0}>미점검</MenuItem>
                    </Select>
                </FormControl></div>

                <div><FormControl variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">건물명</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={building}
                        onChange={ev => setBuilding(ev.target.value as number)}
                        label="Age" >
                    <MenuItem value={-1}> <em>None</em> </MenuItem>
                    {map_info.map((map, key) => <MenuItem value={key} key={key}>{map['name']}</MenuItem>)}
                    </Select>
                </FormControl></div>
            </div>
            <div className={classes.innerMap}>
                <InnerMap
                    allview={false}
                    onClick={(loc) =>  setLocation(loc)}
                    Mark={location}
                    image={building === -1 ? null : map_info[building]['image']}
                />
            </div>
        </div>
    </Dialog>)
}

export default RegistEquip;

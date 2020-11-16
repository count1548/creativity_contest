import React, {createRef, useState, useEffect} from 'react';
import { makeStyles, Theme, createStyles, } from '@material-ui/core/styles'
import Loading from '@material-ui/core/CircularProgress';
import { getAPI, isAvailable } from "../data_function"

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'100%',
    },
}));
let mapData:any[]

export default function ManageMap(props) {
    const {} = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(0);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
  
    useEffect(() => {
        setState('apply')
        getAPI(`/map/all`, 'result').then(res => {
            mapData = res
            setState('show')
        })
    }, [updated])
    if (stat === 'apply') return <div style={{ width: '300px', height:'490px', margin: '30px auto' }}><Loading size={200} /></div>

    return (
        <div className={classes.container}>
            {/*Left Table table click => setSelected / one more click = setSelected(-1)*/}
            {/*Right view Map information (map name / map image)*/}
            {/*Dialog regist / update Map information*/}
        </div>
    )
}
import React, {useState, }  from "react"

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/*eslint-disable */

const Header = ({component}) =>
    <div style={{paddingLeft:'50px', fontSize:'20px', marginBottom:'30px'}}>
        {component}
    </div>

const useStyles = makeStyles((theme) => ({
    root : {
        display:'none'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 186,
        backgroundColor: 'white',
    },
}));

const SelectBox = ({children}) =>
    <div style={{
        width:'calc(100% - 100px)',
        padding:'20px',
        background: '#eee',
        borderRadius:'20px',
        margin:'10px auto'
    }}> 
        {children}
    </div>

const findFittedList = (lineData, campus, way) => {
	if(campus == -1 || way == -1) return null
    let res:any[] = []
    lineData.map((line, key) => {
		const other = (way == 0) ? line['DATA'].length - 1 : 0
		if(line['DATA'][other]['stopName'] == campus) {
            console.log(line)
			const name = (way == 0) ? 
				line['DATA'][0]['stopName'] : 
				line['DATA'][line['DATA'].length - 1]['stopName'] // lineID -> string 으로 변경 시 lineID로 변경
			res.push( {
                'IDX' : key,
				'ID' : line['LINE'],
				'NAME' : name
			})
		}
	})
	if(res.length == 0) return null
	return res
}

const Toolbar = (props) => {
    const {title, data, changeLine} = props
	const [campus, setCampus] = useState('-1')
    const chCampus = event =>  setCampus(event.target.value)
	
	const [way, setWay] = useState('-1')
    const chWay = event =>  setWay(event.target.value)
	
	const [line, setLine] = useState('0')
    const chLine = event =>  {
        setLine(event.target.value)
        changeLine(event.target.value)
    }
	
    const classes = useStyles();
    
    const list = findFittedList(data, campus, way)
    console.log(list)

    return (
        <div style={{
            marginBottom: '30px',
            padding: '10px'
        }}>
            <Header component={title}/>
            <SelectBox>
            <FormControlLabel style={{ width : '30%' }}
                control={
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Campus</InputLabel>
                        <Select
                            value={campus}
                            defaultValue={10}
                            onChange={chCampus}
                            label="Campus"
                            inputProps={{
                                name: 'Campus',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        <MenuItem value={'아산캠퍼스'}>아산캠퍼스</MenuItem>
                        <MenuItem value={'천안캠퍼스'}>천안캠퍼스</MenuItem>
                        <MenuItem value={'당진캠퍼스'}>당진캠퍼스</MenuItem>
                        </Select>
                    </FormControl>
                }
                label="캠퍼스"
                labelPlacement="start"
            />
            <FormControlLabel style={{ width : '30%' }}
                control={
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel htmlFor="outlined-age-native-simple">Way</InputLabel>
                        <Select
                            value={way}
                            defaultValue={10}
                            onChange={chWay}
                            label="Way"
                            inputProps={{
                                name: 'Way',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        <MenuItem value={0}>등교</MenuItem>
                        <MenuItem value={1}>하교</MenuItem>
                        </Select>
                    </FormControl>
                }
                label="등하교"
                labelPlacement="start"
            />
            <FormControlLabel style={{ width : '30%' }}
                control={
                    <FormControl variant="outlined" className={classes.formControl} >
                        <InputLabel htmlFor="outlined-age-native-simple">Line</InputLabel>
                        <Select
                            value={line}
                            defaultValue={10}
                            onChange={chLine}
                            label="Line"
                            inputProps={{
                                name: 'Line',
                                id: 'outlined-age-native-simple',
                            }}
                        >
                        {(list == null) ? null : 
                            list.map((value, idx) =>
                                <MenuItem value={value['IDX']} key={value['ID']}>{value['NAME']}</MenuItem>
                        )}
                        </Select>
                    </FormControl>
                }
                label="노선"
                labelPlacement="start"
            />
            
            </SelectBox>
        </div>
    )
}
export default Toolbar
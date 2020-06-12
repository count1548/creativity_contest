import React, {useState, useEffect}  from "react";
import * as Data from '../data_function';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Table from 'material-table';

interface columnFormat {
    id : number,
    name : string 
}
let oldValue:string = '', 
    lineName:object = {}, 
    timeData:object[],
    columns:any[]|null = null

const dictToArr = (dict:any[]) => {
    let column = {}
    dict.map(data => column[data.id] = data.name)
    return column
}
const pathToStr = (target:object) => {
    let arr:any[] = []
    for(var key in target) if(key !== 'id') 
        arr.push(target[key])
    return arr.join(';')
}

const getLineData = (id, data) => {
    for(var idx = 0; idx < data.length; idx++) // eslint-disable-next-line
        if(data[idx]['id'] == id) return data[idx]
    return {}
}

const setTableColumn = (id, data) => {
    const line = getLineData(id, data)
    const lineList = 
        Data.stringToArr(                
            line['start'] + ',' +
            line['path'] + ',' + 
            line['terminus'], ',').map((value:any) => value*1)

    let columnObj:object[] = 
        lineList.map(idx => {
            return ({
                'title' : lineName[idx],
                'field' : lineName[idx]
            })
        })        
    columnObj.unshift({
        'title' : 'id', 
        'field' : 'id',
        'editable': 'never',
        'width' : '0',
        'hidden' : 'true'
    })

    return columnObj
}

const Notice = props => {
    const [timeStr, setTimetable] = useState<object [] | null>(null)
    const [lineData, setLines] = useState<string [] | null>(null)
    const [ID, setID] = useState<number>(-1)

    const id = props.match.params.id

    const defaultEdit = {
        onRowAdd: newData => {
            Data.setData({
                'lineId' : ID,
                'timeList' : pathToStr(newData)
            }, 'timetable')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('timetable', setTimetable, 'lineId', ID)
                    resolve();
                }, 600);
        })},
        onRowUpdate : newData => {
            Data.updateData({
                'id' : newData['id'],
                'timeList' : pathToStr(newData)
            }, 'timetable')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('timetable', setTimetable, 'lineId', ID)
                    resolve();
                }, 600);
        })},
        onRowDelete : oldData => {
            Data.deleteData(oldData['id'], 'timetable')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('timetable', setTimetable, 'lineId', ID)
                    resolve();
                }, 600);
        })}
    }
    const onSelected = id => {
        columns = setTableColumn(id, lineData)
        Data.getData('timetable', setTimetable, 'lineId', id)
        setID(id)
    }

    useEffect(() => {
        Data.getData('busLine', linesData => {
            Data.getData('LineList', names => {
                lineName = dictToArr(names)
                oldValue = ''
                setLines(linesData)
                if(typeof(id) != 'undefined') {
                    columns = setTableColumn(id, linesData)
                    Data.getData('timetable', setTimetable, 'lineId', id)
                    setID(id)
                }
            })
        })
    }, [id])

    if(timeStr != null) {
        timeData = timeStr.map((value, idx) => {
            const rowData = value['timeList'].split(';')
            rowData.unshift(value['id'])
            let rowFormat = {}
            if(columns != null) for(var i = 0; i < columns.length; i++)
                rowFormat[columns[i]['title']] = rowData[i]
            return rowFormat
        })
    }

    return (
        lineData === null ? <div>Loading...</div> :
        <div style={{'margin' : '30px auto'}}>
            <Autocomplete
                id="combo-box-demo"
                options={lineData}
                getOptionLabel={option => option['name']}
                getOptionSelected={(option, value) => {
                    if (option['name'] === value['name']) {
                        if(oldValue !== value['name']) onSelected(value['id'])
                        oldValue = value['name'] 
                        return true
                    } return false
                }}
                style={{ width: 300 }}
                renderInput={params => 
                    <TextField 
                        {...params} 
                        label="Line list" 
                        variant="outlined" />}
            />
            { columns === null || timeData === null? 
                <div>Selecte line</div> :
                <Table title = "Bus Interval"
                    columns = {columns}
                    data = {timeData} 
                    editable = {defaultEdit}
                    options={{
                            search: false,
                            rowStyle: { backgroundColor: '#EEE', },
                            grouping : true
                        }}/>
            }
        </div>
    )
}

export default Notice;

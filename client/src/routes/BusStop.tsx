import React, {useState, useEffect}  from "react";
import * as Data from '../data_function';
import Table from "../component/Table/Table";
//import Map from "../component/Maps/GoogleMaps";

const BusStop = props => {
    const [busstop, setStopList] = useState<string[]|null>(null)
    let busStopName:object[] = []

    const columns = [
        {
            title : 'ID',
            field : 'id',
            hidden : true,
            editable: 'never', width : 0 
        },
        {
            title : '정류장',
            field : 'busstop',
        },
    ]
    useEffect(() => {
            Data.getData('LineList', setStopList)
    }, [])
    if(busstop !== null) {
        busStopName = busstop.map(data => ({ 'id' : data['id'], 'busstop' : data['name'] }))
    }

    const defaultEdit = {
        onRowAdd: newData => {
            Data.setData({
                'name' : newData['busstop']
            }, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('LineList', setStopList)
                    resolve();
                }, 600);
        })},
        onRowUpdate : newData => {
            Data.updateData({
                'id' : newData['id'],
                'name' : newData['busstop']
            }, 'LineList')
            return new Promise((resolve) => {
                setTimeout(() => {
                    Data.getData('LineList', setStopList)
                    resolve();
                }, 600);
        })},
    }

    return (
        (busstop === null) ? <div>Loading...</div> :
        <div>
            <div style={{
                'width' : '30%',
                'maxHeight' : '100%',
                'float' : 'left',
                'padding' : '10px'
                }}>
                <Table title = ""
                    columns = {columns}
                    source = {busStopName} 
                    
                    defaultEdit = {defaultEdit}
                    options={{
                        rowStyle: { 
                            backgroundColor: '#EEE', 
                        },
                        pageSize : 15,
                    }}
                    />
            </div>
           
        </div>
    )
}

export default BusStop
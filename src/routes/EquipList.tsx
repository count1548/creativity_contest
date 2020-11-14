/*eslint-disable */
import React, { useState, useEffect } from "react"
import { isAvailable, getAPI, setAPI } from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Loading from '@material-ui/core/CircularProgress';
import EquipInfo from '../component/Equipment/EquipInfo'
import EquipStat from '../component/Equipment/EquipStat'
import RegistEquip from '../component/Equipment/RegistEquip'
import '../style/font.css'
import '../style/lineTable.css'

const columns = [
  { title: 'ID', field: 'ID', hidden: true },
  { title: 'Serial number', field: 'serial', width: 150 },
  { title: '위치', field: 'location_name', render: rowData => map_data[rowData['location_name']]['name']},
  {
    title: 'Check', field: 'check', render: rowData =>
      <div style={{
        width: '20px', height: '20px',
        borderRadius: '50%', backgroundColor: (rowData['check'] ? 'green' : 'red'),
      }}></div>
  }
]

async function getData() {
  const equip_data = await getAPI('/equip/list', 'result')
  const map_data = await getAPI('/map/list', 'result')
  
  return { equip_data, map_data }
}
let equip_data: any[], map_data: any[]

const EquipList = props => {
  const [selected, setSelected] = useState<number>(0);
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)

  useEffect(() => {
    getData().then(res => {
      ({ equip_data, map_data } = res)
      if(typeof equip_data === 'undefined') equip_data = []
      if(typeof map_data === 'undefined') map_data = []
      setState('show')
    })
  }, [updated])
  if (stat === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>


  return <>
    <MaterialTable
      title={"Equipment List"}
      columns={columns}
      data={equip_data}
      options={{
        search: false,
        headerStyle: {
          backgroundColor: '#bc1f2f',
          color: '#FFF'
        }, toolbar: false,
        pageSize: 14,
        pageSizeOptions : [5, 10, 14],
        rowStyle: rowData => ({
          backgroundColor: (selected === rowData.tableData.id) ? '#BBB' : '#FFF'
        })
      }}
      onRowClick={((evt, selected: any) => setSelected(selected.tableData.id))}
      style={{ width: 350, float: 'left' }}
    />
    <div style={{ width: 'calc(100% - 350px)', float: 'right' }}>
      <EquipInfo
        stat={'view'}
        title={"장비정보"}
        image={'./imgs/equipment.png'}
        EquipInfo={equip_data[selected]}
        clickButton={()=> setState('regist') }
        map_data={map_data}
      />
      <EquipStat/>
    </div>
    <RegistEquip
      map_info={map_data}
      onSubmit={(data) => {
        setState('apply')
        setAPI('/equip/regist', {
          ...data
        }).then(res => setState('show'))
      }}
      onClose={()=>setState('show')}
      open_p = {stat === 'regist'}
    />
  </>
}

export default EquipList;

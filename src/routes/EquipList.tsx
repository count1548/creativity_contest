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
  { title: 'ID', field: 'id', hidden: true },
  { title: 'Serial', field: 'serial', width: 130 },
  { title: '위치', field: 'boarding_location' },
  {
    title: 'Check', field: 'branch_check', render: rowData =>
      <div style={{
        width: '20px', height: '20px',
        borderRadius: '50%', backgroundColor: (rowData['branch_check'] ? 'green' : 'red'),
      }}></div>
  }
]

async function getData() {
  const equip_data = await getAPI('/equip/list')
  const map_data = await getAPI('/map/list')
  const check_data = await getAPI('/equip/check/all')
  return { equip_data, map_data, check_data }
}
let equip_data: any[] = [], map_data: any[] = [], check_data : any = []

const EquipList = props => {
  const [selected, setSelected] = useState<number>(0);
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)
  useEffect(() => {
    getData().then(res => {
      ({ equip_data, map_data, check_data } = res)
      
      setState('show')
    })
  }, [updated])
  if (stat === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
  else if (equip_data.length === 0) return <div>{/*nodatapage*/}</div>
  else return <>
    <MaterialTable
      title={"Equipment List"}
      columns={columns}
      data={equip_data}
      options={{
        search: false,
        headerStyle: {
          backgroundColor: '#20876F',
          color: '#FFF'
        }, toolbar: false,
        pageSize: 9,
        pageSizeOptions : [5, 9],
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
        EquipInfo={equip_data[selected]}
        check_data = {check_data.filter(check => check['equip_id'] === equip_data[selected]['id'])}
        selected = {selected}
        buttonList = {[
          {
            label : '수정',
            func : () => setState('update')
          }, {
            label : '등록',
            func : () => setState('regist')
          }, {
            label : '삭제',
            func : () => {
              setState('apply')
              setAPI(`/equip/delete`, {
                id : equip_data[selected]['id']
              }).then(res => {
                setSelected(0)
                setUpdated(!updated)
              })
            }
          }
        ]}
        map_data={map_data}
      /> <div style={{margin:'10px'}}><EquipStat/></div>
    </div>
    <RegistEquip
      map_data={map_data}
      onSubmit={(data) => {
        setState('apply')
        setAPI(`/equip/${stat}`, data).then(res => setUpdated(!updated) )
      }}
      update={stat === 'update'}
      onClose={()=>setState('show')}
      open_p = {stat === 'regist' || stat === 'update'}
      defaultData = {equip_data[selected]}
    />
  </>
}

export default EquipList;

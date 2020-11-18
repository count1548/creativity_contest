/*eslint-disable */
import React, { useState, useEffect } from "react"
import { isAvailable, getAPI, getAPI_local, setAPI } from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Loading from '@material-ui/core/CircularProgress';
import EquipInfo from '../component/Equipment/EquipInfo'
import EquipStat from '../component/Equipment/EquipStat'
import InnerMap from '../component/Map/InnerMap'
import '../style/font.css'
import '../style/lineTable.css'

const columns = [
  { title: 'ID', field: 'id', hidden: true },
  { title: 'Serial number', field: 'serial', width: 150 },
  { title: '위치', field: 'boarding_location' },
  {
    title: 'Check', field: 'check', render: rowData =>
      <div style={{
        width: '20px', height: '20px',
        borderRadius: '50%', backgroundColor: (rowData['check'] ? 'green' : 'red'),
      }}></div>
  }
]
async function getData() {
  const equip_data = await getAPI_local('/equip/list', 'GET', 'result')
  const map_data = await getAPI_local('/download/map', 'GET', 'result')
  return { equip_data, map_data }
}

let equip_data: any[] = [], map_data: any[] = []

const MapLayout = props => {
  const [selected, setSelected] = useState<number>(0);
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)

  useEffect(() => {
    getData().then(res => {
      ({ equip_data, map_data } = res)
      setState('show')
    })
  }, [updated]) 
  if (stat === 'apply' || equip_data.length === 0) return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>

  return <>
    <div style={{
        width:'800px', height:'400px', margin:'0 auto',
        border:'1px solid grey'
    }}>
        <InnerMap
            image={map_data[equip_data[selected]['map']]['image']}
            Mark = {equip_data.filter(equip => equip['map'] === equip_data[selected]['map'])}
            specialMark = {selected}
            allowClick={false}
            wdt={800} hgt={400}
            onClick={(data) => {
                console.log(data.color)
                if(data.color[0] === data.color[1] && data.color[1] === data.color[2]) return;
                let res = 0
                equip_data.find((equip, idx) => {
                    if(equip['id'] === data.object['id']) { res = idx; return true }
                })
                setSelected(res)
            }}
        />
    </div>
    <div style={{ width: 'calc(100% - 350px)', margin:'0 auto' }}>
      <EquipInfo
        stat={'view'}
        image={'./imgs/equipment.png'}
        EquipInfo={equip_data[selected]}
        map_data={map_data}
        innerState = {true}
        limit = {4}
      />
    </div>
  </>
}

export default MapLayout;
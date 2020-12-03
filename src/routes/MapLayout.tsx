/*eslint-disable */
import React, { useState, useEffect } from "react"
import { isAvailable, getAPI, setAPI } from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Loading from '@material-ui/core/CircularProgress';
import EquipInfo from '../component/Equipment/EquipInfo'
import EquipStat from '../component/Equipment/EquipStat'
import InnerMap from '../component/Map/InnerMap'
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  const equip_data = await getAPI('/equip/list')
  const map_data = await getAPI('/map/list')
  return { equip_data, map_data }
}

let equip_data: any[] = [], map_data: any[] = []

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: '10px auto',
        minWidth: 120,
    },
}));
let equip_list
const MapLayout = props => {
  const [map, setMap] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)
  const classes = useStyles()

  useEffect(() => {
    getData().then(res => {
      ({ equip_data, map_data } = res)
      setState('show')
    })
  }, []) 
  if (stat === 'apply' || equip_data.length === 0) return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
  
  const Mark_list = equip_data.filter(equip => equip['map'] == map_data[map]['id'])
  equip_list = Mark_list
  console.log(equip_list)
  return <>
    <div>
          <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">맵 선택</InputLabel>
              <Select
                  native
                  value={map}
                  onChange={(ev: React.ChangeEvent<{ name?:string; value: unknown }>) => {
                      setMap(ev.target.value as number)
                      setSelected(0)
                  }}
                  label="Map"
                  >
                  <option aria-label="None" value="" />
                  {map_data.map((map, idx) => <option value={idx} key={idx}>{map['name']}</option>)}
              </Select>
          </FormControl>
    </div>
    <div style={{
        width:'800px', height:'400px', margin:'0 auto',
        border:'1px solid grey'
    }}>
        <InnerMap
            image={map_data[map]['image']}
            Mark = {Mark_list}
            specialMark = {selected}
            allowClick={false}
            wdt={800} hgt={400}
            onClick={(data) => {
                if(data.color[0] === data.color[1] && data.color[1] === data.color[2]) return;
                let res = 0
                if(typeof data.object === 'undefined') return;
                equip_list.find((equip, idx) => {
                    if(equip['id'] === data.object['id']) { res = idx; return true }
                })
                setSelected(res)
            }}
        />
    </div>
    <div style={{ width: 'calc(100% - 350px)', margin:'0 auto' }}>
      <EquipInfo
        stat={'view'}
        EquipInfo={Mark_list[selected]}
        map_data={map_data}
        checklog = {false}
        InnerState = {
        <EquipStat>
            <table>
                <tbody>
                    <tr><td>현재 맵 내부 총 개수</td><td>{Mark_list.length}</td></tr>
                    <tr><td>점검 완료</td><td>{Mark_list.filter(equip => equip['check']).length}</td></tr>
                    <tr><td>점검 미완료</td><td>{Mark_list.filter(equip => !equip['check']).length}</td></tr>
                    <tr><td>점수 평균</td><td>80</td></tr>
                </tbody>
            </table>
        </EquipStat>}
        limit = {2}
      />
    </div>
  </>
}

export default MapLayout;
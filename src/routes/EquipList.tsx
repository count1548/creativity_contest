/*eslint-disable */
import React, { useState, useEffect } from "react"
import { isAvailable, getAPI, setAPI } from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import Loading from '@material-ui/core/CircularProgress';
import EquipInfo from '../component/Equipment/EquipInfo'
import '../style/font.css'
import '../style/lineTable.css'

const columns = [
{ title: 'ID', field: 'ID', hidden: true },
{ title: 'Serial number', field: 'serial', width: 150 },
{ title: '위치', field: 'location', },
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
	const check_log = await getAPI('/check_log/all', 'result');
		if (!isAvailable(equip_data)) return {equip_data :[]}

	return { equip_data, check_log }
}
let equip_data:any[], check_log:any[]

const EquipList = props => {
	const [selected, setSelected] = useState<number>(0);
	const [stat, setState] = useState('apply')
		const [updated, setUpdated] = useState(true)

		useEffect(() => {
			getData().then(res => {
				({equip_data, check_log} = res)
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
					pageSize: 12,
					rowStyle: rowData => ({
						backgroundColor: (selected === rowData.tableData.id) ? '#BBB' : '#FFF'
					})
				}}
				onRowClick={((evt, selected: any) => setSelected(selected.tableData.id))}
				style={{ width: 350, float: 'left' }}
			/>
			<div style={{ width: 'calc(100% - 350px)', float: 'right' }}> { /* equipment box */}
				<EquipInfo
					stat={'view'}
					title={"장비정보"}
					image={'./imgs/equipment.png'}
					EquipInfo={equip_data[selected]}
				/>
				
				<div> { /* 일반 정보 (등록 개수 / 점검현황 / 상태평균 / 지난 달 점검현황) box */} </div>
			</div>
			</>
}

export default EquipList;

import React, {createRef, useState, useEffect} from 'react';
import { makeStyles, Theme, createStyles, } from '@material-ui/core/styles'
import Loading from '@material-ui/core/CircularProgress';
import { getAPI, setAPI, isAvailable } from "../data_function"
import MaterialTable from 'material-table'
import Tooltip from '../component/Tooltip'
import InnerMap from '../component/Map/InnerMap'

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'100%',
    },
	infoBox : {
		float:'right',
		width : 'calc(100% - 252px)',
		minHeight : '300px', padding:'0 0 0 30px',
		background : '#eee'
	},
	inTable : {
		'& .MuiTablePagination-selectRoot' : {
			display:'none',
			'&~div' : { margin:'0 auto' }
		},
	},
	imagePreview : {
		display:'block',
		width:'400px', height:'200px',
		margin:'10px auto', borderRadius:'5px',
	}
}));
let mapData:any[]

const columns = [
  { title: 'ID', field: 'ID', hidden: true },
  { title: '건물명', field: 'name', width: 130 },
  { title: '', field: 'image', render: rowData =>
   	rowData['image'] ? 
	  <Tooltip content={
		<InnerMap 
			image={rowData['image']}
			wdt={300} hgt={150}
			allowClick={false}
			/>
		}><img width={20} height={20} src={'./imgs/exist.png'}/></Tooltip> : null },
]

let _file:null|any = null

const onUpload = (data, setState) => {
	const formData = new FormData();
    formData.append('file', _file);
	setState('apply')
    setAPI("/map/upload", {
		...data, 
		image : formData,
	}).then(res => setState('show'))
}

export default function ManageMap(props) {
    const {} = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(-1);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
	const [src, setSrc] = useState('./imgs/noimg.png')
	
    useEffect(() => {
        setState('apply')
        getAPI(`/map/list`, 'result').then(res => {
            mapData = res
			_file = null
            setState('show')
        })
    }, [updated])
    if (stat === 'apply') 
		return <div style={{ 
					width: '300px', 
					height:'490px', 
					margin: '30px auto' }}>
					<Loading size={200} />
				</div>

	const onFileSet = (ev) => {
		console.log('file upload')
		_file = ev.target.files[0] 
		ev.target.files[0] = null
		setSrc(window.URL.createObjectURL(_file))
	}
	console.log(src)
    return (
        <div className={classes.container + ' ' + classes.inTable}>
			<MaterialTable
				title={"Equipment List"}
				columns={columns}
				data={mapData}
				options={{
					search: false,
					headerStyle: {
					backgroundColor: '#bc1f2f',
					color: '#FFF'
					}, toolbar: false,
					pageSize: 11,
					pageSizeOptions : [11, 5],
					paginationType : 'stepped',
					rowStyle: rowData => ({
						backgroundColor: (selected === rowData.tableData.id) ? '#BBB' : '#FFF'
					})					
			 	}}
				onRowClick={(ev, cell: any) => {
					if(stat !== 'show') return;
					const selected_number = cell.tableData.id
					if(selected == selected_number) {
						setSelected(-1) 
						setSrc('./imgs/noimg.png')
					}
					else {
						setSelected(selected_number)
						setSrc('./imgs/' + mapData[selected_number]['image'])
					}					
				}}
				style={{ width: 222, float: 'left' }}
			/>
			<div className={classes.infoBox}>
				<label htmlFor='image_file'>
					<img 
						className={classes.imagePreview} src={src}
						onError={(e:any) => {
							e.target.onerror=null
							e.target.src = './imgs/noimg.png'
						}}/>
				</label>
				<input id='image_file' type='file' name='image_file' style={{
					display:'none',
				}} onChange={onFileSet}/>
			</div>
            {/*Right view Map information (map name / map image)*/}
            {/*Dialog regist / update Map information*/}
        </div>
    )
}
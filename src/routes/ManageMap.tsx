import React, {createRef, useState, useEffect} from 'react';
import { makeStyles, Theme, createStyles, } from '@material-ui/core/styles'
import Loading from '@material-ui/core/CircularProgress';
import { getAPI, setAPI, isAvailable } from "../data_function"
import MaterialTable from 'material-table'
import Tooltip from '../component/Tooltip'
import InnerMap from '../component/Map/InnerMap'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
    container : {
        '&:after' : {
            content : '\' \'',
            display : 'block',
            clear : 'both',
        },
        width:'100%', textAlign:'center'
    },
	dataBox : {
		float:'right',
		width : 'calc(100% - 252px)',
		minHeight : '300px', marginLeft:'30px',	
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
		margin:'10px auto', borderRadius:'5px', border:'1px solid grey',
	},
	textBox : {
		width:'200px',
		margin:'10px auto',	
	},
	topMenu : { position:'relative', borderBottom:'2px solid #bbb' },
	title : {
		float:'left',
		fontSize:'18px',
		padding:'6px'
	},
	buttonGroup : {
		position:'absolute',
		right:'0'
	},
	alignCenter : { display:'inline-block', },
	infoBox : {
		width:'80%',
		padding:'10px',
		margin:'100px auto 0 auto',
		background:'#fed',
		borderRadius : '5px'
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

let _file:null|any = null, name_text:string = ''

const onUpload = (data, setState, target = 'update') => {
	if(data['name'] === '') return;

	const formData = new FormData();
    formData.append('file', _file);
	setState('apply')
    setAPI(`/map/${target}`, 'POST', {
		...data, 
		image : formData,
	}).then(res => setState('show'))
	.catch(err => console.error(err))
}
const base_img = 'https://fakeimg.pl/400x200/?text=Click+Me'

export default function ManageMap(props) {
    const {} = props
    const classes = useStyles()
    const [selected, setSelected] = useState<number>(-1);
    const [stat, setState] = useState('apply')
    const [updated, setUpdated] = useState(true)
	const [src, setSrc] = useState(base_img)
	const [name, setName] = useState('')

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
	if (mapData.length === 0) return <div></div> // no data page 
	const onFileSet = (ev) => {
		_file = ev.target.files[0]
		ev.target.value = null
		setSrc(window.URL.createObjectURL(_file))
	}

	const initState = () => {setSelected(-1); setState('show'); setSrc(base_img); setName('')}

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
					const selected_number = cell.tableData.id
					setSelected(selected_number)
					setSrc('./imgs/' + mapData[selected_number]['image'])
					setName(mapData[selected_number]['name'])
				}}
				style={{ width: 222, float: 'left' }}
			/>
			<div className = {classes.dataBox}>
				<div className={classes.container + ' ' + classes.topMenu}>
					<div className={classes.title}>맵수정</div>
					<div className={classes.buttonGroup}>
						<Button onClick = {() => initState()}>생성하기</Button>
					</div>
				</div>
				<div className={classes.infoBox}>
					<label htmlFor='image_file'>
						<img 
							className={classes.imagePreview} src={src}
							onError={(e:any) => {
								e.target.onerror=null
								e.target.src = base_img
							}}/>
					</label>
					<input id='image_file' type='file' name='image_file' style={{
						display:'none',
					}} onChange={onFileSet}/>

					<div className={classes.textBox}>
						<TextField
							id="standard-textarea"
							placeholder="맵이름"
							inputProps={{min: 0, style: { textAlign: 'center' }}}
							value={name}
							onChange={(ev) => setName(ev.target.value)}
							/>
					</div>
					<div className={classes.alignCenter}>
						<Button 
							variant="contained" 
							color="primary"
							onClick={() => onUpload({
								id : (selected === -1 ? null : mapData[selected]['id']),
								name : name,
							}, setState, selected === -1 ? "create" : "update")}>
						Submit </Button>
					</div><br/>
					<div className={classes.alignCenter}>
						<Alert severity="error">400x200 크기의 도면 이미지를 권장합니다.</Alert>
					</div>
				</div>
			</div>
        </div>
    )
}
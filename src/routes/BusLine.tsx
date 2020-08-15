/*eslint-disable */
import React, { useState, useEffect } from "react"
import TransferList from '../component/LineList/'
import {isAvailable, getAPI, dictToArr, dictToArr_s, setAPI, setTimeTable} from '../data_function'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Dropzone from '../component/Dropzone'
import Toolbar from '../component/Table/Toolbar'
import Table from '../component/Table/'
import NoData from '../component/Table/NoData'
import Loading from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import Dialog from '../component/Dialog'

import '../style/font.css'
import '../style/lineTable.css'

const columns = ['노선', '월', '화', '수', '목', '금']
const week = 5
async function getData() {
  const stops = await getAPI('bus/stop/', 'BUS_STOP')
  const times = await getAPI('bus/time/', 'TIME_TABLE')
  const lines = await getAPI('bus/line/', 'BUS_LINE')
  if( !isAvailable(stops) || 
      !isAvailable(times) || 
      !isAvailable(lines)) return {lineData : {}, stopData : {}, timeData : {}}
    
  const lineData = dictToArr(lines, 'BUS_LINE_NAME', null, true)
  const stopData = dictToArr(stops, 'CODE', null, true)
  const timeData = dictToArr(times.map(time => ({
    ...time,
    'BUS_TIME' : time['BUS_TIME'].split(':').slice(0, 2).join(':')
  })),'IDX_BUS_LINE', null, true)
  
  return { lineData, stopData, timeData }
}

const findNames = (object, name) => object['BUS_LINE_NAME'] === name
const findStops = (object, name) => {
  const res = object.filter(value => value['BUS_STOP_NAME'] === name)
  return (res.length !== 0)
}
const findWays = (name, way) => name.indexOf(way) !== -1 
const findTimes = (object, IDX_BUS_LINE) => object['IDX_BUS_LINE'] === IDX_BUS_LINE

let stopData:Object, lineData: Object, timeData: Object, 
    lineNames: string[], stopNames: string[],
    selectedLines:string[] = [], newLineName:string = ''

const BusLine = props => {
  const [stat, setState] = useState('apply')
  const [updated, setUpdated] = useState(true)

  const [campus, setCampus] = useState('')
  const [way, setWay] = useState('')
  const [lineName, setLine] = useState<any | null>('')
  const [required, setRequired] = useState(false)

  const init = () => { setCampus(''); setWay(''); setLine(''); newLineName = ''}

  //setting table head data
  useEffect(() => {
    //update 대기
    getData().then(res => {
      ({lineData, stopData, timeData} = res)
      setState('show')
    }).catch(err => console.log(err))
  }, [updated])

  if (stat === 'apply') return <div style={{ width: '300px', margin: '30px auto' }}><Loading size={200} /></div>
  
  const dataToJson = ({row, column, value}) => ({
    IDX_BUS_LINE : lineData[lineName].find((value, idx) => (idx === row))['IDX_BUS_LINE'],
    WEEK_OF_DAY : column,
    BUS_TIME : value
  })

  const selected = [(campus !== '' && way !== ''), (lineName !== ''), (stat !== 'create-line')]

  if(selected[0] && selected[2]) selectedLines = Object.keys(lineData)
      .filter(name => findStops(lineData[name], campus))
      .filter(name => findWays(name, way))
  if(selected[1] && !isAvailable(lineData[lineName])) { init(); return null }
  
  const createButtonForm = (label, to) => ({ label: label, action: () => setState(to) })
  const buttons = {
    'return': createButtonForm('돌아가기', 'show'),

    'update': createButtonForm('수정하기', 'update'),
    'update-line': createButtonForm('노선수정', 'update-line'),
    'update-time': createButtonForm('시간수정', 'update-time'),

    'create-line': createButtonForm('생성하기', 'create-line'),

    'delete-line': createButtonForm('삭제하기', 'delete-line'),
    'upload': createButtonForm('불러오기', 'upload')
  }

  const getButtonList = stat => {
    let bntlist: Object[] = [buttons['return']]

    switch (stat) {
      case 'show':
        bntlist = [buttons['upload']]
        if (selected[1]) {
          bntlist.push(buttons['update'], buttons['delete-line'])
        }
        if (selected[0]) bntlist.push(buttons['create-line'])
        break
      case 'update':
        if (selected[1]) bntlist = [buttons['update-line'], buttons['update-time']]
        break
    }

    return bntlist
  }


  const forms = [
    [{
      name: '캠퍼스',
      label: 'Campus',
      type : 'select',
      options: [
        { value: '아산캠퍼스', label: '아산캠퍼스' },
        { value: '천안캠퍼스', label: '천안캠퍼스' },
        { value: '당진캠퍼스', label: '당진캠퍼스' }
      ],
      onChange: value => {
        setLine('')
        setCampus(value)
      },
      value: campus,
      disable: () => (stat !== 'show')
    },
    {
      name: '등하교',
      label: 'Way',
      type : 'select',
      options: [
        { value: '등교', label: '등교' },
        { value: '하교', label: '하교' },
      ],
      onChange: value => {
        setLine('')
        setWay(value)
      },
      value: way,
      disable: () => (stat !== 'show')
    },
    {
      name: '노선',
      label: 'Line',
      ...(selected[2]) ? {
        type : 'select',
        options: selectedLines.map((name, idx) => ({
          value : name,
          label : name.split('_')[0]
        })),
        onChange: value => setLine(value),
        value: lineName,
        disable: () => ((selectedLines.length === 0) || stat !== 'show')
      } : {
        type : 'text',
        onChange: value => {newLineName = value},
        value: newLineName,
      }
    },]
  ]

  const displayComponent = () => {
    let listProps:{chData : any[], onSubmit (list : any[]) : any }|null = null
    let component = <NoData message='Please Select Options' />

    switch(stat) {
      case 'create-line':
        listProps = {
          chData : [campus],
          onSubmit : list => {
            if(newLineName === '' || list.length < 2) {
              setRequired(true)
              return
            }
            setState('apply')
            setAPI('/bus/line/create', {
              'lineName': `${newLineName}_${way}`, 'data': list
            }).then(res => {init(); setUpdated(!updated)})
          }
        }
        break
      case 'update-line':
        listProps = {
          chData : lineData[lineName].map(line => line['BUS_STOP_NAME']),
          onSubmit : list => {
            if(list.length < 2) { setRequired(true); return }
            setState('apply')
            setAPI('/bus/line/update', {
              'lineName': lineName, 'data': list
            }).then(res => setUpdated(!updated))
          }
        }
        break
    }
    if(stat === 'update-line' || stat === 'create-line') {
      if(listProps !== null) component = <TransferList
          allData={stopData[way].map(data => data['BUS_STOP_NAME'])}
          title={'노선'}
          {...listProps}
        />
    }
    else if(selected[1]) {
      const record = lineData[lineName].map(data => {
        if (typeof (timeData[data['IDX_BUS_LINE']]) === 'undefined') return new Array(5)
        else return timeData[data['IDX_BUS_LINE']].map(time => time['BUS_TIME'])
      })

      component = <Table
        column={columns}
        isRowHead = {true}
        rowHead={lineData[lineName].map(data => data['BUS_STOP_NAME'])}
        record={record}
        editable={(stat === 'update-time')}
        headWidth={20}
        button={stat === 'update-time' ? 'apply' : null}
        onSubmit={(chlist) => {
          setState('apply')
          setAPI(
            '/bus/time/update',
            { timeList: chlist.map(data => dataToJson(data)) })
            .then(res => setUpdated(!updated))
        }}
      />
    }

    return component
  }
  const displayModal = () => {
    let component: any = null

    switch (stat) {
      case 'delete-line':
        if (!selected[1]) return null
        component = 
          <Dialog
            onSubmit = {()=>{
              setState('apply')
              setAPI('/bus//shuttle/line/delete', {
                'lineName': lineName,
              }).then(res => setUpdated(!updated))
              init()
            }} onExit={() => setState('show')}
            submitMsg = {'Delete'}
            type={'text'}
            defaultState={true}
          >노선을 삭제하시겠습니까?</Dialog>
        break
      case 'upload':
        component = 
          <Dropzone
            defaultState={true}
            onClose={() => setState('show')}
            onSave={files => {
              setState('apply')
              setTimeTable(files, 'bus').then(res => {
                console.log(files, typeof (files[0]))
                setUpdated(!updated)
              }).catch(err => console.log(err))
            }}/>
    }
    return (component)
  }
  return (
    <div>
      <Toolbar
        title='통학버스 시간표'
        inputForm={forms}
        buttons={getButtonList(stat)} />
      {displayComponent()}
      {displayModal()}
      <Dialog
        children={'필수 항목을 입력하십시오'}
        onSubmit = {()=>setRequired(false)}
        onExit = {()=>setRequired(false)}
        defaultState={required}
      />
    </div>
  )
}

export default BusLine;

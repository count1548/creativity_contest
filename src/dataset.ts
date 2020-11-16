const moment = require('moment')

const equip_data = [{
    id: 0,
    serial: 1254524,
    map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 1,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 2,
    serial: 4565244,map : 1,location:{x:100,y:170},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 3,
    serial: 1208424,map : 1,location:{x:110,y:120},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 4,
    serial: 1254524,map : 1,location:{x:30,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 5,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 6,
    serial: 4565244,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 7,
    serial: 1208424,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 8,
    serial: 1254524,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 9,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 10,
    serial: 4565244,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 11,
    serial: 1208424,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 12,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 13,
    serial: 1208424,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 14,
    serial: 1254524,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 15,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 16,
    serial: 4565244,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 17,
    serial: 1208424,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 18,
    serial: 1254524,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 19,
    serial: 2125423,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }, {
    id: 20,
    serial: 4565244,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 1
  }, {
    id: 21,
    serial: 1208424,map : 1,location:{x:100,y:100},boarding_location:'1공대 1층 화장실앞',
    check: 0
  }]
  const d = moment(new Date())
  const _date = d.format('YY/MM/DD HH:mm')
  const check_log = [{
    id : 0,
    equip_id : 0,
    check_res : [0, 1, 2, 3, 4],
    date : _date,
    user : '점검자1',
  }, {
    id : 1,
    equip_id : 0,
    check_res : [0, 1, 2],
    date : _date,
    user : '점검자1',
  }, {
    id : 2,
    equip_id : 4,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자1',
  }, {
    id : 3,
    equip_id : 0,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 4,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 5,
    equip_id : 0,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 3,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 4,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 5,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 3,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 4,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    id : 5,
    equip_id : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  },
  ]
const map_data = [
  {
    'name' : '2공대',
    'image' : '2building.png',
  },{
    'name' : '1공대',
    'image' : '1building.png',
  },{
    'name' : '3공대',
    'image' : '3building.png',
  },
]
  export {equip_data, check_log, map_data};
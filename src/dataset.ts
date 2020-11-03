const moment = require('moment')

const equip_data = [{
    ID: 0,
    serial: 1254524,
    location : 'location',
    check: 1
  }, {
    ID: 1,
    serial: 2125423,location : 'location',
    check: 1
  }, {
    ID: 2,
    serial: 4565244,location : 'location',
    check: 1
  }, {
    ID: 3,
    serial: 1208424,location : 'location',
    check: 0
  }, {
    ID: 4,
    serial: 1254524,location : 'location',
    check: 0
  }, {
    ID: 5,
    serial: 2125423,location : 'location',
    check: 0
  }, {
    ID: 6,
    serial: 4565244,location : 'location',
    check: 1
  }, {
    ID: 7,
    serial: 1208424,location : 'location',
    check: 0
  }, {
    ID: 8,
    serial: 1254524,location : 'location',
    check: 0
  }, {
    ID: 9,
    serial: 2125423,location : 'location',
    check: 0
  }, {
    ID: 10,
    serial: 4565244,location : 'location',
    check: 1
  }, {
    ID: 11,
    serial: 1208424,location : 'location',
    check: 0
  }]
  const d = moment(new Date())
  const _date = d.format('YY/MM/DD HH:mm')
  const check_log = [{
    ID : 0,
    equip_ID : 2,
    check_res : [0, 1, 2, 3, 4],
    date : _date,
    user : '점검자1',
  }, {
    ID : 1,
    equip_ID : 2,
    check_res : [0, 1, 2],
    date : _date,
    user : '점검자1',
  }, {
    ID : 2,
    equip_ID : 4,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자1',
  }, {
    ID : 3,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 4,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 5,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 3,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 4,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 5,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 3,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 4,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  }, {
    ID : 5,
    equip_ID : 7,
    check_res : [0, 1, 2, 3, 4, 5],
    date : _date,
    user : '점검자2',
  },

  ]

  export {equip_data, check_log};
const columns = [
    { title: 'ID', field: 'id', type: 'numeric', editable: 'never', width : 30  },
    { title: '노선', field: 'name', width:100 },
    { title: '출발', field: 'start'},
    { title: '경유', field: 'path', editable: 'never'},
    { title: '도착', field: 'terminus', },
    
]
export default columns;
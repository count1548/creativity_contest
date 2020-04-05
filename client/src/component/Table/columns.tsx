const columns = [
    { title: 'ID', field: 'id', type: 'numeric', editable: 'never', width : 30  },
    { title: '노선', field: 'name', width:100 },
    { title: '출발', field: 'startName'},
    { title: '경유', field: 'pathName', editable: 'never'},
    { title: '도착', field: 'terminusName', },    
]
export default columns;
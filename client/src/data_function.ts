const host = "http://192.168.198.128"
const getData = (target, setState, id = null) => {    
    fetch(`${host}:3001/getData/`, {
        method: 'POST',
        body : JSON.stringify({
            target : target,
            id : id
        }),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseData => {
        setState(responseData)
    })
	.catch(error=> console.log('Error fetching ',error) );
}
const setData = (data, _target) => {
    let columns:string[] = []
    let values:string[] = []

    for(var key in data) {
        columns.push(key)
        data[key] = data[key] == null ? 'null' : data[key]
        values.push(`'${data[key]}'`)
    }

    const cString = columns.join(', ')
    const vString = values.join(', ')

    fetch(`${host}:3001/setData/`, { 
        method: 'POST',
        body : JSON.stringify({
            target : _target,
            colunms : cString,
            values : vString
        }),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.catch(error => console.log('Error fetching ',error))
}

const updateData = (data, _target) => {
    let set:string[] = []

    for(var key in data) {
        if(data[key] == null) data[key] = 'null'
        set.push(`${key}='${data[key]}'`)
    } const setString = set.join(',')

    
    fetch(`${host}:3001/updateData/`, {
        method: 'POST',
        body : JSON.stringify({
            target : _target,
            set : setString,
            id : data['id']
        }),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.catch(error => console.log('Error fetching ',error))
}
const deleteData = (_id, _target) => {    
    fetch(`${host}:3001/deleteData/`, {
        method: 'POST',
        body : JSON.stringify({
            target : _target,
            id : _id
        }),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	.catch(error => console.log('Error fetching ',error))
}

export {getData, setData, updateData, deleteData}
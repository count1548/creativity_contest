const host = "http://192.168.198.128"

const getData = setState => {
    const query = ""
    fetch(`${host}:3001/getData/`, {
        method: 'POST',
        body : JSON.stringify({query : query}),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then((response) => response.json())
    .then((responseData) => {
        setState(responseData[0])
	})
	.catch((error)=>{ console.log('Error fetching ',error); });
}
const setData = (data, target, setState) => {
    let columns:string = ''
    let values:string = ''

    for(var key in data) {
        columns += `, ${key}`
        if(data[key] == null) values += `, null`
        else values += `, '${data[key]}'`
    }
    columns = columns.replace(',', '')
    values = values.replace(',', '')
    const query = `INSERT INTO ${target} (${columns}) VALUE (${values})`

    fetch(`${host}:3001/setData/`, {
        method: 'POST',
        body : JSON.stringify({query : query}),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseData => {
        setState(responseData[0])
	})
	.catch(error => console.log('Error fetching ',error))
}

const transString = arr => {
    
}

export {getData, setData}
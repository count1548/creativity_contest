const host = "http://uck.myds.me"
const getData = (target, setState, col:string|null = null, value:number|null = null) => {
    fetch(`${host}:3001/getData/`, {
        method: 'POST',
        body : JSON.stringify({
            target : target, 
            column : col,
            value : value
        }),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseData => setState(responseData) )
	.catch(error=> console.log('Error fetching ',error) );
}
const getAPI = (target, name, setState) => {
    return fetch(`${host}:7000/${target}`, {
        method: 'GET',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(res => res.json())
    .then(res => {
        var data
        switch(name) {
            case 'BUS_STOP' :
                data = dictToArr(res[name])
                break
            case 'BUS_LINE' :
                data = res[name]
        }
        setState(data)
        
    })
}

const dictToArr = (dict:any[]) => {
    let column = {}
    dict.map(data => column[data['BUS_STOP_ID']] = data['BUS_STOP_NAME'])
    return column
}

const stringToArr = (str:string, sep:string) => str.split(sep)
const arrToString = (str:any[], sep:string) => str.join(sep)

export { getData, getAPI }

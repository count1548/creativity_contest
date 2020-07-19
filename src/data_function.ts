const host = "http://uck.myds.me"

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }


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
                data = dictToArr(res[name], 'BUS_STOP_ID', 'BUS_STOP_NAME')
                break
            default :
                data = res[name]
        }
        setState(data)
        
    })
}

const dictToArr = (dict:any[], idxName:string, value:string|null = null) => {
    let column = {}
    dict.map(data => 
        column[data[idxName]] = (value == null) ? _objectWithoutProperties(data, [idxName]) : data[value]
    )
    return column
}

const stringToArr = (str:string, sep:string) => str.split(sep)
const arrToString = (str:any[], sep:string) => str.join(sep)

export { getData, getAPI }

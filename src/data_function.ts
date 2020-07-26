const host = "http://uck.myds.me:7000"

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getAPI = (target, name, setState) => {
    return fetch(`${host}/${target}`, {
        method: 'GET',
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(res => res.json())
    .then(res => setState(res[name]) )
}

const dictToArr = (dict:any[], idxName:string, value:string|null = null, array=false) => {
    let column = {}
    dict.map(data => {
        const v_data = (value == null) ? _objectWithoutProperties(data, [idxName]) : data[value]
        if(array) {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = []
            column[data[idxName]].push(v_data)
        }
        else column[data[idxName]] = v_data
    })
    return column
}

const dictToArr_s = (dict:any[], idxName:string, idxName2:string, value:string|null = null, array=false) => {
    let column = {}
    dict.map(data => {
        const v_data = (value == null) ? _objectWithoutProperties(data, [idxName, idxName2]) : data[value]
        if(array) {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = {}
            if(typeof(column[data[idxName]][data[idxName2]]) == 'undefined') column[data[idxName]][data[idxName2]] = []
            column[data[idxName]][data[idxName2]].push(v_data)
        }
        else column[data[idxName]][data[idxName2]] = v_data
    })
    return column
}

const stringToArr = (str:string, sep:string) => str.split(sep)
const arrToString = (str:any[], sep:string) => str.join(sep)

const findFittedList = (lineData, campus, way) => {
	if(lineData == null || campus === '' || way === '') return null
    let res:any[] = []
    lineData.map((line, key) => {
		const other = (way == 0) ? line['DATA'].length - 1 : 0
		if(line['DATA'][other]['stopName'] == campus) {
			const name = (way == 0) ? 
				line['DATA'][0]['stopName'] : 
				line['DATA'][line['DATA'].length - 1]['stopName'] // lineID -> string 으로 변경 시 lineID로 변경
			res.push( {
                'IDX' : key,
				'ID' : line['LINE'],
				'NAME' : name
			})
		}
    })
	return (res.length == 0) ? null : res
}

export { getAPI, findFittedList, dictToArr, dictToArr_s }

const host = "http://uck.myds.me:3001"


function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getAPI = (target, name) => {
    return new Promise<any[]>((resolve, reject) => {
        fetch(`${host}/${target}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => resolve(res[name]))
        .catch(err => reject(err))
    })
    
}
const setAPI = (target, data) => {
    // return fetch(`${host}/${target}`, {
    //     method: 'POST',
    //     	headers:{
    //     		'Accept': 'application/json',
    //     		'Content-Type': 'application/json'
    //         },
    //     body : JSON.stringify(data)
	// })
    // .then(res => setState(value))
    console.log({
        url : target,
        body : JSON.stringify(data),
    })
    return new Promise((res, rej) => {
        setTimeout(()=>(res('success')), 1000)
    })
}

const setTimeTable = (data, target) => {
    return new Promise((resolve, rej) => {
        fetch(`${host}/${target}/import/`, {
            method: 'POST',
            headers : {'Content-Type': 'multipart/form-data'},
            body : data
        })
        .then(res => resolve(res))
        .catch(err => {
            console.log(err)
            rej(err)
        })
    })
}

// const arrayToDict = (arr:Object[], idxList:string[], valueList:string[], retArr = false) => {
//     var column
//     const len = idxList.length

//     const getTaget = idx => {

//     }

//     if(idxList.length <= 1)  
//     const data = dictToArr(arr, idxList.shift(), null, true)

//     for(var key in data) {
//         data[key] = dictToArr(data[key], idxList[0], null, true)
//     }

//     arr.forEach ( (object, idx) => {
//         idxList.forEach ( key => {
//             if()
//         })
//     })
// }

const dictToArr = (dict:any[], idxName:string, value:string|null = null, array=false) => {
    let column = {}
    dict.forEach(data => {
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
    dict.forEach(data => {
        const v_data = (value == null) ? _objectWithoutProperties(data, [idxName, idxName2]) : data[value]
        if(array) {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = {}
            if(typeof(column[data[idxName]][data[idxName2]]) == 'undefined') column[data[idxName]][data[idxName2]] = []
            column[data[idxName]][data[idxName2]].push(v_data)
        }
        else {
            if(typeof(column[data[idxName]]) == 'undefined') column[data[idxName]] = {}
            column[data[idxName]][data[idxName2]] = v_data
        }
    })
    return column
}
const findFittedList = (lineData, campus, way) => {
    if(campus === '' || way === '') return null
    let res:any[] = []
    lineData.forEach((line, key) => {
		const other = (way === 0) ? line['DATA'].length - 1 : 0
		if(line['DATA'][other]['stopName'] === campus) {
			const name = (way === 0) ? 
				line['DATA'][0]['stopName'] : 
				line['DATA'][line['DATA'].length - 1]['stopName'] // lineID -> string 으로 변경 시 lineID로 변경
			res.push( {
                'IDX' : key,
				'ID' : line['LINE'],
				'NAME' : name
			})
		}
    })
	return (res.length === 0) ? null : res
}

export { getAPI, setAPI, findFittedList, dictToArr, dictToArr_s, setTimeTable }

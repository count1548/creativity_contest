const host = "http://uck.myds.me"

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getAPI = (target, name, port=3001) => {
    return new Promise<any[]>((resolve, reject) => {
        fetch(`${host}:${port}/${target}`, {
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
const setAPI = (target, data, port=3333) => {
    console.log({
        url : target,
        body : data,
    })
    return new Promise<any>((resolve, reject) => {
        fetch(`${host}:${port}/${target}`, {
            method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            body : JSON.stringify(data)
        })
	.then(res => {
		console.log(res)
		resolve('success')
	})
        .catch(err => reject(err))
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
            if(typeof(column[data[idxName]]) === 'undefined') column[data[idxName]] = []
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

const isAvailable = object => 
  !(typeof(object) === 'undefined' || 
  Object.keys(object).length === 0)


export { getAPI, setAPI, dictToArr, dictToArr_s, setTimeTable, isAvailable }

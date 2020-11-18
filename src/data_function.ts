/*eslint-disable */
const host = "http://210.119.104.154"
const {equip_data, check_log, map_data} = require('./dataset')

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const getAPI = (target, port=3001) => {
    return new Promise<any[]>((resolve, reject) => {
        fetch(`${host}:${port}${target}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(typeof res['message'] !== 'undefined') resolve([])
            resolve(res)
        })
        .catch(err => resolve([]))
    })
}

const getAPI_local = (target, type='POST', name='result', port=3001, id:number|null=null) => {
    return new Promise<any>((resolve, reject) => {
        setTimeout(()=> {
            if(target == '/equip/list') resolve(equip_data)
            else if(target == '/check_log/all') resolve(check_log)
            else if(target == '/check_log/id') 
                resolve(check_log.filter(value => 
										 value['equip_id'] == id))
            else if(target == '/download/map') 
                resolve(map_data)
            reject([])
        }, 100)
    })
}

const setAPI = (target, type, data, port=3001) => {
    console.log(`${host}:${port}${target}`)
    console.log(JSON.stringify(data))
    return new Promise<any>((resolve, reject) => {
        fetch(`${host}:${port}${target}`, {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data),
        })
	.then(res => {
		if(typeof data['file'] !== 'undefined') {
            fetch(`${host}:${port}/upload/img`, {
                method: 'POST',
                body : data['file'],
            }).then(res => resolve(res))
        }
		resolve('success')
	}).catch(err => reject(err))})
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


export { getAPI, setAPI, dictToArr, dictToArr_s, setTimeTable, isAvailable, getAPI_local }

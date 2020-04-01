import {data_format, commentFormat} from '../database';
/*load data & save data*/
const host = "http://192.168.198.128"
const getData = (id:number, setState:any) : any => {
    fetch(`${host}:3001/getNotice/${id}`, {
		method: 'GET',
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
const setData = (data : data_format) : void => {
    let query:string;
    let columns:string = '';
    let values:string = '';

    for(var key in data) {
        if(key == 'id') continue
        columns += `, ${key}`
        values += `, '${data[key]}'`
    }
    query = `INSERT INTO bbs (${columns.replace(',', '')}) VALUE (${values.replace(',', '')})`
    console.log(query);
    fetch(`${host}:3001/setNotice`, {
		method: 'POST',
		body : JSON.stringify({query : query}),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).catch((error)=>{ console.log('Error fetching ',error); });
    //localData.push(data);
}

const getCommentData = (id:number, setState:any) : any => {
    fetch(`${host}:3001/getComment/${id}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then((response) => response.json())
    .then((responseData) => setState(responseData))
	.catch((error)=>{ console.log('Error fetching ',error); });
}

const setCommentData = (data : commentFormat, setState:any) : void => {
    let query:string;
    let columns:string = '';
    let values:string = '';

    for(var key in data) {
        if(key == 'id') continue
        columns += `, ${key}`
        if(data[key] == null) values += `, null`
        else values += `, '${data[key]}'`
    }
    query = `INSERT INTO comment (${columns.replace(',', '')}) VALUE (${values.replace(',', '')})`
    fetch(`${host}:3001/setComment`, {
		method: 'POST',
		body : JSON.stringify({query : query}),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
    }).then((response) => {
        getCommentData(data.bbs_id, setState)
    })
    .catch((error)=>{ console.log('Error fetching ',error); });
    //localData.push(data);
}

const getUnreadList = (id:number, target:string, setState:any) : any => {
    fetch(`${host}:3001/getUnread/${id}/${target}`, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then((response) => response.json())
    .then((responseData) => setState(responseData))
	.catch((error)=>{ console.log('Error fetching ',error); });
}

export {getData, setData, getCommentData, setCommentData, getUnreadList};
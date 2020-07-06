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
const getData_s = (options, setState) => {
    return fetch(`${host}:3001/getData_s/`, {
        method: 'POST',
        body : JSON.stringify(options),
		headers:{
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
    .then(res => res.json())
    .then(res => {setState(res)})
}
const stringToArr = (str:string, sep:string) => str.split(sep)
const arrToString = (str:any[], sep:string) => str.join(sep)

export {
    getData, getData_s
}

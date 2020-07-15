mysql = require('mysql')
express = require('express')
bodyParser = require('body-parser')
path = require('path')
cors = require('cors')

const dbconfig = require('../dbinfo.json')
const connection = mysql.createConnection(dbconfig)

const app = express()
const port = 3001

app.use(cors())
app.use('/', express.static('./client/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
})

app.post('/getData_s', (req, res) => {
    const {target} = req.body    
    const query = `SELECT * FROM ${target}`
    connection.query(query, (err, rows) => {
        if(err) throw err
        res.send(rows)
    })
})

app.post('/getData', (req, res) => {
    const {target, column, value} = req.body    
    let where = ''
    if(column != null) where = `WHERE ${column} = '${value}'`
    const query = `SELECT * FROM ${target} ${where}`
    connection.query(query, (err, rows) => {
	if(err) console.log(err)
        //if(err) throw err;
        if(err) res.send('mysql error : check server log')
        res.send(rows)
    })
})
app.post('/setData', (req, res) => {
    const {target, columns, values} = req.body
    const query = `INSERT INTO ${target} (${columns}) VALUE (${values})`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

app.post('/updateData', (req, res) => {
    const {target, set, id} = req.body
    const query = `UPDATE ${target} SET ${set} WHERE id='${id}'`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

app.post('/deleteData', (req, res) => {
    const {target, id} = req.body
    const query = `DELETE FROM ${target} WHERE id='${id}'`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

const server = app.listen(port, () => console.log('Express listening on port', port))

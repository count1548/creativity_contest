mysql = require('mysql');
express = require('express')
bodyParser = require('body-parser');
path = require('path');
cors = require('cors');

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
    next();
});

app.post('/getData', (req, res) => {
    const {target, id, colunms} = req.body    
    let where = '', colunmstr = '*', query = ''

    if(id != null) where = `WHERE id = '${id}'`
    if(colunms != null) colunmstr = colunms

    query = `SELECT ${colunmstr} FROM ${target} ${where}`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send(rows);
    })
})

app.post('/setData', (req, res) => {
    const {target, columns, values} = req.body
    const query = `INSERT INTO ${target} (${columns}) VALUE (${values})`

    console.log(query)
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

app.post('/updateData', (req, res) => {
    const {target, set, id} = req.body
    const query = `UPDATE ${target} SET ${set} WHERE id='${id}'`
    console.log(query)
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
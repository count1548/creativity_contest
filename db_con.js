import mysql from 'mysql';
import express from 'express'
import bodyParser from 'body-parser';
import path from 'path';

const dbconfig = require('./dbinfo.json')
const connection = mysql.createConnection(dbconfig)

const app = express()
const port = 3001

app.use('/', express.static('./client/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/db', (req, res) => {
    connection.query("SELECT * FROM bbs", (err, rows) => {
        if(err) throw err;
        res.send(rows);
    })
})
const server = app.listen(port, () => console.log('Express listening on port', port))
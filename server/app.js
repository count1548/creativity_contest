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

app.post('/setNotice', (req, res) => {
    connection.query(req.body.query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

app.post('/setComment', (req, res) => {
    connection.query(req.body.query, (err, rows) => {
        if(err) throw err;
        res.send("success");
    })
})

app.get('/getUnread/:id/:target', (req,res) => {
    var query = `SELECT id, name FROM USER WHERE 
                    (department='${req.params.target}') AND
                    NOT(readList LIKE '.${req.params.id}.')
                    ORDER BY id;`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send(rows);
    })
})

app.get('/getComment/:id', (req,res) => {
    var query = `SELECT * FROM comment WHERE bbs_id=${req.params.id} ORDER BY IF(ISNULL(parent_id), id, parent_id), id;`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send(rows);
    })
})

app.get('/getList', (req, res) => {
    var query = 'SELECT b.id, b.title, b.sender, b.receiver, b.read_num, b.file, b.time, (SELECT COUNT(*) FROM comment WHERE bbs_id = b.id ORDER BY bbs_id)comment_num FROM bbs b ORDER BY b.id'
    connection.query(query, (err, rows) => {
        if(err) throw err
        res.send(rows)
    })
})

app.get('/getNotice/:id', (req, res) => {
    var query = `SELECT * FROM bbs WHERE id=${req.params.id}`
    connection.query(query, (err, rows) => {
        if(err) throw err;
        res.send(rows);
    })
})


const server = app.listen(port, () => console.log('Express listening on port', port))
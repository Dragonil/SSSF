const express = require('express')
const db = require('mongoose')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const crud = require('./modules/CRUD')
const app = express()
const http = express()
const log = require('morgan')
db.connect('mongodb://localhost/catdb');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};

const catSchema = new db.Schema({
    Name: String,
    Age: Number,
    Gender: {
        type: String,
        enum: ['male', 'female']
    },
    Color: String,
    Weight: Number,
    ImgLink: String
});

const cat = db.model('Cat', catSchema);
const dbmw = new crud('Cats', catSchema)

const router = express.Router();
require('./router')(router, dbmw);

app.use('/cat', router)
app.use(bodyParser())
app.use(log('dev'))
http.use(log('debug'))

app.use('/', express.static('./public'))



app.post('/cats', (req, res) => {
    cat.create(req.body, function (err, cat) {
        if (err) return handleError(err);
        res.send(`Cat ${cat.name} created`)
      })
    
})

app.get('/cats', (req, res) => {
    cat.find((err, cats) => {
        if (err) return console.error(err);
        res.send(cats);
      })
    
})

http.get('/', (req, res) => { res.redirect('https://localhost:8080')})


http.listen(8081)
https.createServer(options, app).listen(8080)
const express = require('express')
const db = require('mongoose')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const crud = require('./modules/CRUD')
const app = express()
const http = express()
const log = require('morgan')
const pass = require('passport')
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

pass.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || password !== process.env.password) {
            done(null, false, {message: 'Incorrect credentials.'});
            return;
        }
        return done(null, {}); // returned object usally contains something to identify the user
    }
));


// Middelware
app.use(bodyParser())
app.use(log('dev'))
http.use(log('debug'))
app.use(pass.initialize())

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};


db.connect('mongodb://localhost/catdb')
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
const dbmw = new crud('Cats', catSchema)


const router = express.Router();
require('./router')(router, dbmw);

app.use('/cat', router)

app.use('/', express.static('./public'))


app.post('/login', 
  pass.authenticate('local', { 
    successRedirect: '/', 
    failureRedirect: '/login.html', 
    session: false })
);

http.get('/', (req, res) => { res.redirect('https://localhost:8080')})


http.listen(8081)
https.createServer(options, app).listen(8080)
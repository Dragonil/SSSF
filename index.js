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
const session = require('express-session')
const helmet = require('helmet')
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

pass.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.username || password !== process.env.password) {
            done(null, false, {message: 'Incorrect credentials.'});
            return;
        }
        return done(null, {id: process.env.userid, name: process.env.username}); // returned object usally contains something to identify the user
    }
));

pass.serializeUser(function(user, cb) {
    console.log('Serial')
    cb(null, user.id);
  });
  
pass.deserializeUser(function(id, cb) {
    console.log('Deserial')
    cb(null, {id: id});
});
  

const login = (req, res, next) => {
    console.log(req.user)
    if(req.user){
        next()
    }else{
        res.redirect('/login')
    }

}

// Middelware
app.use(bodyParser.urlencoded({ extended: true })) // For Formdata
app.use(bodyParser.json()); // For JSON
app.use(log('dev'))
http.use(log('common'))
app.use(helmet())
app.use(session({ secret: process.env.SessionSeed, resave: false, saveUninitialized: false }));
app.use(pass.initialize())
app.use(pass.session());
app.enable('trust proxy')

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};

db.connect(`mongodb://${process.env.DBUser}:${process.env.DBPW}@${process.env.DBURL}:27017/catdb`)
const catSchema = new db.Schema({
    Name: String,
    Age: Number,
    Gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    Color: String,
    Weight: Number,
    ImgLink: String
});
const dbmw = new crud('Cats', catSchema)

http.get('/',  (req, res) => { res.redirect('https://'+process.env.MASTER_IP+':8080/')})
app.get('/', login, (req, res) => { res.redirect('/ui')})
app.use('/', express.static('./public')) // js and css

app.get('/login', (req, res)=>{res.sendFile(__dirname + '/templates/login.html')})

app.post('/login', 
  pass.authenticate('local', { 
    successRedirect: '/ui', 
    failureRedirect: '/login'
    } )
)

app.get('/logout', function(req, res){
    req.logout()
    res.redirect('/')
})


const api = express.Router()
require('./api')(api, dbmw)
app.use('/cat',login, api)

const ui = express.Router()
require('./ui')(ui, dbmw)
app.use('/ui',login, ui)


http.listen(8081)
https.createServer(options, app).listen(8080)
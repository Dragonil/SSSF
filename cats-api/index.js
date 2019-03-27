const express = require('express')
const db = require('mongoose')
const bodyParser = require('body-parser')
const crud = require('./modules/CRUD')
const app = express()

db.connect('mongodb://localhost/catdb');

const catSchema = new db.Schema({
    Name: String,
    Age: Number,
    Gender: {
        type: String,
        enum: ['male', 'female']
    },
    Color: String,
    Weight: Number
});

const cat = db.model('Cat', catSchema);
const dbmw = new crud('Cats', catSchema)

app.use(bodyParser())

app.get('/', (req, res) => {
    res.send('Cat DB')
});

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

app.post('/create', dbmw.create, (req, res) => {
    res.send('Object created')
})

app.get('/read', dbmw.read, (req, res) => {
    res.send(req.body)
})

app.patch('/update', dbmw.update, (req, res) => {
    res.send('Object updated')
})

app.delete('/delete', dbmw.delete, (req, res) => {
    res.send('Object deleted')
})


app.listen(8080)
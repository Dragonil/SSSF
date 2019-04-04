const Handlebars = require('handlebars')
const fs = require('fs')
let index, details, create

fs.readFile('./templates/index.hbs', (err, data)=>{
    if(err){ 
        index = Handlebars.compile("ERROR")
    }else{
        index = Handlebars.compile(data.toString('utf8'))
    }
    
})
fs.readFile('./templates/details.hbs', (err, data)=>{
    if(err){ 
        details = Handlebars.compile("ERROR")
    }else{
        details = Handlebars.compile(data.toString('utf8'))
    }
    
})
fs.readFile('./templates/create.hbs', (err, data)=>{
    if(err){ 
        create = Handlebars.compile("ERROR")
    }else{
        create = Handlebars.compile(data.toString('utf8'))
    }
    
})


module.exports = function(app, db) {
    
    app.get('/', db.read, (req, res) => {
        res.send(index(req.body))
    })
    
    app.get('/details/:id', db.read, (req, res) => {
        res.send(details(req.body))
    })

    app.get('/create', db.getSchema, (req, res) => {
       console.log(req.schema)
        res.send(create())
    })
    
  };
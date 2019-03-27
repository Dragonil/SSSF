const db = require('mongoose')

 
function CRUD(collection /* String */, schema /* mongoose.Schema */) { 
    CRUD.prototype.model = db.model(collection, schema)
    console.log('Model initialized ')
}
CRUD.prototype.create = (req, res, next) => {
    if(!CRUD.prototype.model) throw new Error('No Model initialized')
    CRUD.prototype.model.create(req.body, (err, data) => {
        if (err){
            res.send('Can`t create Object')
        } else{
            console.log(data, ' created')
            next()
        }
        
    })
}
CRUD.prototype.read = (req, res, next) => {
    if(!CRUD.prototype.model) throw new Error('No Model initialized')
    if(req.query){ // for GET requests
        var filter = req.query
    }else if(req.body){ // for other requests
        var filter = req.body
    }else{
        var filter = {} // no filter
    }
    if(filter.id){
        var filter = {_id: filter.id }
    }
    
    CRUD.prototype.model.find(filter, req.body, (err, data) => {
        if (err){
            res.send('Can`t find Object')
        } else{
            req.body = data
            next()
        }
        
    })
}
CRUD.prototype.update = (req, res, next) => {
    if(!CRUD.prototype.model) throw new Error('No Model initialized')
    if(req.body.id){
        var id = req.body.id
    }else{
        var id = -1 // no valid id
    }
    
    CRUD.prototype.model.updateOne({_id: id }, req.body, (err, data) => {
        if (err){
            res.send('Can`t update Object')
        } else{
            console.log(`Object ${id} updated =>` , data)
            next()
        }
        
    })
},
CRUD.prototype.delete = (req, res, next) => {
    if(!CRUD.prototype.model) throw new Error('No Model initialized')
    if(req.param.id){
        var id = req.param.id
    }else if(req.query.id){
        var id = req.query.id
    }else if(req.body){
        var id = req.body.id
    }else{
        var id = -1 // no valid id
    }
    
    CRUD.prototype.model.deleteOne({_id: id }, (err) => {
        if (err){
            res.send('Can`t delete Object')
        } else{
            console.log(`Object ${id} deleted`)
            next()
        }
        
    })
}

module.exports = CRUD
    

const db = require('mongoose')
function CRUD(collection /* String */, schema /* mongoose.Schema */) { 
    CRUD.prototype.model = db.model(collection, schema)
    CRUD.prototype.schema = schema
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

CRUD.prototype.genFilter = (keyword)=>{
    let filter = '{ "$or": ['
    CRUD.prototype.schema.eachPath((path)=> {
        filter += `{"${path}": {"$regex": ".*${keyword}.*", "$options": "i"}},`
    })
    filter = filter.slice(0, -1)
    filter += ']}'
    console.log(filter)
    return JSON.parse(filter)
}

CRUD.prototype.getSchema = (req, res, next) =>{
    let s = {keys:[]}
    CRUD.prototype.schema.eachPath((path) => {
        s.keys.push(path)
    })
    req.schema = s
    next()
}

CRUD.prototype.read = (req, res, next) => {
    if(!CRUD.prototype.model) throw new Error('No Model initialized')

    if(req.query.keyword != null){ // for GET requests
        var filter = { Name: {$regex: `.*${req.query.keyword}.*`, $options: "i"}} 
    }else if(req.body.keyword != null){ // for other requests
        var filter = { Name: {$regex: `.*${req.body.keyword}.*`, $options: "i"}} 
    }else{
        var filter = {} // no filter
    }
    if(req.query.id){
        var filter = {_id: req.query.id }
    }else if(req.params.id){
        var filter = {_id: req.params.id }
    }else if(req.body.id){
        var filter = {_id: req.body.id }
    }
    console.log(req.params, filter)
    CRUD.prototype.model.find(filter,  (err, data) => {
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
    console.log(req.body)
    if(req.body){
        var id = req.body.id
    }else{
        var id = -1 // no valid id
    }
    console.log(req.body," -  ", id)
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
    

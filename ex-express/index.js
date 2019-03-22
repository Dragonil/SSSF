const express = require('express')
const db = require('mongoose')
const fs = require('fs')
const hbs = require('handlebars')
const multer = require('multer')({limits: { fileSize:1000*1024 }})
const bp = require('body-parser')
const uuid = require('uuid/v4')
const morgan = require('morgan')
const imgtrans = require('./img.js')
const app = express();

const template = fs.readFileSync('./template.hbs').toString()


db.connect('mongodb://localhost:27017/image')
const schema = new db.Schema({
    Title: String,
    Desc: String,
    Link: String,
    Tag: String
})

const Image = db.model('Image', schema);

app.use(morgan('dev'))

app.use(bp())
app.use(express.static('./upload'))

app.post('/upload', multer.single('image'), (req, res)=>{
    let id = uuid()
    console.log('upload', req.file)
    imgtrans.small(req.file.buffer).save(id)
    Image.create({Title: req.body.Title, Desc: req.body.Desc, Link: id, Tag: req.body.Tag}).then((data)=>{
        res.redirect('/collection')
    })
});

app.use('/', express.static('./public/'))
app.use('/images', express.static('./upload/'))

function getTags(){
    return new Promise((resolve, reject) =>{
        let tags = []
        Image.find({}).select('Tag').exec((err, data)=>{
            if(err) resolve(tags)
            data.forEach(tag => {
                if(!tags.includes(tag.Tag)) tags.push(tag.Tag)
            });
            console.log(tags)
            resolve(tags)
        })
    })
}

app.get('/collection', (req, res) => {
    if(req.query.tag){
        var filter = {Tag: req.query.tag}
    }else{
        var filter = { }
    }
    getTags().then((tags)=>{
        const temp = hbs.compile(template)
        Image.find(filter).exec((err, data)=>{
            if(err){
                res.send("No Data found")
            }
            res.send(temp({content: data, tags: tags}))
        })
    })

    
})
app.listen(3000)



module.exports = function(app, db) {
    app.post('/', db.create, (req, res) => {
        res.redirect('/')
    })
    
    app.get('/', db.read, (req, res) => {
        res.send(req.body)
    })
    
    app.post('/p', db.update, (req, res) => {
        res.send(req.body)
    })
    
    app.delete('/', db.delete, (req, res) => {
        res.redirect('/')
    })
  };
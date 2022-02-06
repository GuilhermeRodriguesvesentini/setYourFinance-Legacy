var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('setYourFinance',['financeiro']);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'finance')));

app.get('/', function(req, res){
    res.send('it works!');
});

app.get('/financeiro', function(req, res){
    db.financeiro.find(function(err, docs){
        if(err){
            res.send(err);
        }else {
            console.log('Getting data...');
            res.json(docs);
        }
    });
});

app.post('/financeiro', function(req, res){
    db.financeiro.insert(req.body, function(err, doc){
        if(err){
            res.send(err);
        } else {
            console.log('Adding data...');
            res.json(doc);
        }
    });
});

app.put('/financeiro/:id', function(req, res){
    db.financeiro.findAndModify({query:{_id: mongojs.ObjectId(req.params.id)},
     update: {$set:{
         nome: req.body.nome,
         vencimento: req.body.vencimento,
         valor: req.body.valor
     }},
     new: true
    }, function(err, doc){
        if(err){
            res.send(err);
        } else {
            console.log('Updating data...');
            res.json(doc);
        }
    });
});

app.delete('/financeiro/:id', function(req, res){
    db.financeiro.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, doc){
        if(err){
            res.send(err);
        } else {
            console.log('Removing data...');
            res.json(doc);
        }
    });
});



app.listen(3000);
console.log('Running on port 3000...');
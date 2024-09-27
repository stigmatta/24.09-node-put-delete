var express  = require('express'); 
var app = express();

var path = require('path');
var bodyParser = require('body-parser'); 

var port = 8080; 

var displayHandler = require('./js/displayhandler'); 
var insertHandler = require('./js/inserthandler'); 
var editHandler = require('./js/edithandler'); 

app.set('views', __dirname + '/pages'); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'pages')));

var jsonParser = bodyParser.json();
var textParser = bodyParser.text(); 

app.use(jsonParser); 
app.use(textParser); 

app.get('/', displayHandler.displayItems);

app.get('/add', insertHandler.loadAddPage); 
app.post('/add/newItem', insertHandler.addRow); 

app.get('/edit', displayHandler.displayItems); 

app.get('/edit/:id', editHandler.loadEditPage);

app.put('/edit/:id', editHandler.changeItem);

app.delete('/edit/:id', editHandler.removeItem); 


app.listen(port, function() { 

	console.log('app listening on port ' + port); 

});  

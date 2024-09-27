const express = require('express'); 
const mssql = require('mssql');
const path = require('path');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser'); 


const app = express();
const port = 8080; 

const displayHandler = require('./js/displayhandler'); 
const insertHandler = require('./js/inserthandler'); 
const editHandler = require('./js/edithandler'); 
const queries = require('./js/queries');

app.set('views', path.join(__dirname, 'pages')); 
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'pages')));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(bodyParser.text()); 

app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'pages', 'authorization.html'));
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading page');
    }
});

app.post('/admin', queries.login);

app.get('/add', insertHandler.loadAddPage); 
app.post('/add/newItem', insertHandler.addRow); 

app.get('/edit', displayHandler.displayItems); 
app.get('/edit/:id', editHandler.loadEditPage);
app.put('/edit/:id', editHandler.changeItem);
app.delete('/edit/:id', editHandler.removeItem); 

app.listen(port, () => { 
    console.log('App listening on port ' + port); 
});  

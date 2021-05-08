const express = require('express');
const session = require ('express-session');
const handlebars = require('express-handlebars');
const fs = require('fs');

const app = express();
const PORT = 3000;

//Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
}));
app.set('views', __dirname);
app.engine('hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: __dirname,
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

//Db

const users = JSON.parse(fs.readFileSync('db.json'));

//Routes

app.get('/home', (req, res) => {
    res.send('Home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).send('Fill all the fields');
    }
    const user = users.find(user=> user.email === req.body.email);
    if(!user || user.password !== req.body.password){
        return res.status(400).send('Invalid credentials');
    }
    req.session.userId = user.id;
    console.log(req.session);
    res.send('OK');
});

//Server

app.listen(PORT, () => console.log('Listening on port', PORT));
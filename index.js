const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();

var hbs = exphbs.create({
    layoutsDir: './views/layouts',
    helpers: {}
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname,'./public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

// open({
//     filename: './log_database.db',
//     driver: sqlite3.Database
// }).then(async function (db) {

//     // run migrations

//     // await db.migrate();

//     // only setup the routes once the database connection has been established

    app.get('/', function (req, res) {
        res.render('login', {
            title: 'Login',
            layouts: 'main',
        });        
    });

    app.post('/login', async function (req, res) {
     
      
    });
// })

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})
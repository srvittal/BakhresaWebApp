const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const moment = require('moment');

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
        // res.render('login', {
        //     title: 'Login',
        //     layouts: 'main',
        // });     
        res.redirect('/add');   
    });

    app.post('/', async function (req, res) {
        let username = 'suda';
        let password = 'test';

        // await db.all('SELECT * FROM customer_login WHERE Username = ? AND Pwd = ?', req.body.username, req.body.password)
        //     .then(function (customer_login) {
        //         if (customer_login.length != 0) {
        //             username = customer_login[0].Username;
        //             password = customer_login[0].Pwd;
        //             req.session.Name = customer_login[0].Firstname + " " + customer_login[0].Lastname;
        //             req.session.userName = username;
        //         } else {
        //             username = ' ';
        //             password = ' ';
        //         }
        //     });

        if (username == req.body.username && password == req.body.password) {
            req.session.loginMessage = "Logged In";
            res.redirect('/add');
        } else {
            req.session.loginMessage = "Incorrect Username or Password";
            res.redirect('/');
        }


    });

    function getTime(){
        moment().format("hh:mm:ss A");
    }

    app.get('/add', function (req, res) {
        let d = moment().format("DD-MMM-YYYY");
        let t = getTime();
        res.render('vehicleAdd', {
            title: 'Addmission',
            layouts: 'main',
            date: d,
            time: t
        });        
    });
// })

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})
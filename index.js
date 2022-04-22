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

app.use('/public', express.static(path.join(__dirname, './public')));

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
    //     title: 'BSA Login',
    //     layouts: 'main',
    // });     
    res.redirect('/group');
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
        res.redirect('/group');
    } else {
        req.session.loginMessage = "Incorrect Username or Password";
        res.redirect('/');
    }


});

app.get('/group', function (req, res) {
    res.render('group', {
        title: 'BSA Group'
    })
})

app.post('/group', function (req, res) {
    if (req.body.group == "employee") {
        console.log("Employee")
        res.redirect("/add/employee")
    } else if (req.body.group == "visitor") {
        console.log("Visitor")
        res.redirect("/add/visitor")
    } else if (req.body.group == "transporter") {
        console.log("Transporter")
        res.redirect("/add/transporter")
    }
})

app.get('/add/:group', function (req, res) {
    let name = "";
    if (req.params.group == "visitor") {
        name = "Visitor Addmission"
        res.render('visitor', {
            title: name,
            layouts: 'main',
        });
    } else if (req.params.group == "employee") {
        name = "Employee Addmission"
        res.render('employee', {
            title: name,
            layouts: 'main',
        });
    } else if (req.params.group == "transporter") {
        name = "Transporter Addmission"
        res.render('transport', {
            title: name,
            layouts: 'main',
        });
    }
});
// })

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
})
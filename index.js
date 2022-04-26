const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const moment = require('moment');
const test = require('./test');

const app = express();
const testApp = test();
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

open({
    filename: './log_database.db',
    driver: sqlite3.Database
}).then(async function (db) {

    await db.migrate();

    app.get('/', function (req, res) {
        res.render('login', {
            title: 'BSA Login',
            layouts: 'main',
        });     
        //res.redirect('/group');
    });

    app.post('/', async function (req, res) {
        let username = 'suda';
        let password = 'test';
        let type = 'admin'

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
            if(type == 'super-user'){
                res.render('group', {
                    title: 'Superuser',
                    layouts: 'main'
                })
            } else if(type == 'admin'){
                // res.render('adminDashboard', {
                //     title: 'Dashboard',
                //     layouts: 'main'
                // })
                res.send("This is the admin dashboard")
            } else if(type == 'user'){
                // res.render('userDashboard', {
                //     title: 'Dashboard',
                //     layouts: 'main'
                // })
                res.send("This is the user dashboard")
            }
            req.session.loginMessage = "Logged In";
        } else {
            req.session.loginMessage = "Incorrect Username or Password";
            res.redirect('/');
        }


    });

    app.get('/group', function (req, res) {
        res.render('group', {
            title: 'BSA Group',
            layouts: 'main'
        })
    })

    app.post('/group', function (req, res) {
        if (req.body.group == "employee") {
            res.redirect("/add/employee")
        } else if (req.body.group == "visitor") {
            res.redirect("/add/visitor")
        } else if (req.body.group == "transporter") {
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
            name = "Employee Addmission";
            let group = "";
            if (!req.session.compSelect) {
                group = "all";
            } else {
                group = req.session.compSelect;
            }
            let aArr = ["Amelia", "Alfie", "Ava", "Archie", "Alexander", "Alice", "Amy", "Aaron"];
            let bArr = ["Brooke", "Bobby", "Bella", "Ben", "Bethany", "Blake", "Beatrice", "Baby"];
            let cArr = ["Charlie", "Chloe", "Charlotte", "Connor", "Cameron", "Conor", "Caitlin", "Cara"];
            res.render('employee', {
                title: name,
                layouts: 'main',
                compSelect: group,
                helpers: {
                    groupSelector(alpha) {
                        if (alpha == "all") {
                            return [aArr, bArr, cArr]
                        } else if (alpha == "bsa") {
                            return bArr
                        } else if (alpha == "indgro") {
                            return cArr
                        }
                    },
                    filter(arr, option) {
                        var ret = "";

                        for (var i = 0; i < arr.length; i++) {
                            ret = ret + option.fn(arr[i]);
                        }

                        return ret;
                    }
                }
            });
        } else if (req.params.group == "transporter") {
            name = "Transporter Addmission";
            res.render('transport', {
                title: name,
                layouts: 'main',
            });
        }
    });

    app.post('/employee', function (req, res) {
        req.session.compSelect = req.body.compSelect;
        res.redirect('/add/employee');
    });

    app.post('/addmission', function (req, res) {

    });

    app.post('/transporter', function (req, res) {

    });

});

const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
});
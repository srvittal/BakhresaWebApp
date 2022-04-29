const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const uuid = require('uuid').v4;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const moment = require('moment');
const Database = require('./database');
const DB = Database();

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        const data = DB.getUser(username);
        const user = data[0];
        if (!user) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        if (!bcrypt.compareSync(password, user.Pwd)) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, user);
    }
));

// tell passport how to serialize the user
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});



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

app.use(session({
    genid: function (req) {
        return uuid()
    },
    store: new FileStore(),
    resave: true,
    saveUninitialized: true,
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 }
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/', function (req, res) {
    res.render('login', {
        title: 'BSA Login',
        layouts: 'main',
    });
    //res.redirect('/group');
});

app.post('/', function (req, res, next) {
    passport.authenticate('local', { failureRedirect: '/' },
        function (err, user, info) {
            if (err) { return next(err); };
            if (!user) { return res.redirect('/'); }
            req.login(user, function (err) {
                if (err) { return next(err); }
                if (user.AccType == 'super-user') {
                    res.render('group', {
                        title: 'Superuser',
                        layouts: 'main'
                    })
                } else if (user.AccType == 'admin') {
                    // res.render('adminDashboard', {
                    //     title: 'Dashboard',
                    //     layouts: 'main'
                    // })
                    res.send("This is the admin dashboard")
                } else if (user.AccType == 'user') {
                    // res.render('userDashboard', {
                    //     title: 'Dashboard',
                    //     layouts: 'main'
                    // })
                    res.send("This is the user dashboard")
                }
            })
        })(req, res, next)
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



const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
});
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

let BSA0 = {
    CompanyGroup: 'BSA',
    NameInfo: 'EMP 1 - BSA',
    VehicleReg: '123',
    VehicleType: 'Car'
}
let BSA1 = {
    CompanyGroup: 'BSA',
    NameInfo: 'EMP 2 - BSA',
    VehicleReg: '456',
    VehicleType: 'Van'
}
let BSA2 = {
    CompanyGroup: 'BSA',
    NameInfo: 'EMP 3 - BSA',
    VehicleReg: '789',
    VehicleType: 'Car'
}
let indgro0 =
{
    CompanyGroup: 'Indgro',
    NameInfo: 'INDGRO EMP 001',
    VehicleReg: '147',
    VehicleType: 'Van'
}
let indgro1 = {
    CompanyGroup: 'Indgro',
    NameInfo: 'INDGRO EMP 002',
    VehicleReg: '258',
    VehicleType: 'Car'
}
let indgro2 = {
    CompanyGroup: 'Indgro',
    NameInfo: 'INDGRO EMP 003',
    VehicleReg: '369',
    VehicleType: ''
}


try {
    DB.addUser('super-user', 'sudarshan', 'BSA@123789');
    DB.addUser('admin', 'admin', 'BSA@123456');
    DB.employees('add', BSA0);
    DB.employees('add', BSA1);
    DB.employees('add', BSA2);
    DB.employees('add', indgro0);
    DB.employees('add', indgro1);
    DB.employees('add', indgro2);
} catch (error) {
    console.log(error);
}

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
    genid: function () {
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
    // res.render('login', {
    //     title: 'BSA Login',
    //     layouts: 'main',
    // });
    res.redirect('/group');
});

app.post('/', function (req, res, next) {
    passport.authenticate('local', { failureRedirect: '/' },
        function (err, user, info) {
            if (err) { return next(err); };
            if (!user) { return res.redirect('/'); }
            req.login(user, function (err) {
                if (err) { return next(err); }
                req.session.AccType = user.AccType;
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
    // if(req.isAuthenticated() == true){
    //     res.render('group', {
    //         title: 'BSA Group',
    //         layouts: 'main'
    //     })
    // } else {
    //     res.redirect("/");
    // }
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

        let BSA = DB.fetchEmp('BSA');
        let Indgro = DB.fetchEmp('Indgro')
        res.render('employee', {
            title: name,
            layouts: 'main',
            compSelect: group,
            groupClass: group,
            helpers: {
                groupSelector(alpha) {
                    if (alpha == "all") {
                        return BSA.concat(Indgro);
                    } else if (alpha == "bsa") {
                        return BSA;
                    } else if (alpha == "indgro") {
                        return Indgro;
                    }
                },
                filter(arr, option) {
                    let ret = "";

                    for (let i = 0; i < arr.length; i++) {
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

app.post('/addmission', function (req, res) {
    let data = {
        id: uuid().toString(),
        DateOfEntry: moment().format("DD-MM-YY"),
        TimeOfEntry: moment().format('hh:mm:ss A'),
        NameInfo: req.body.name,
        VehicleReg: req.body.vehicleReg,
        VehicleType: req.body.type,
        AddGroup: "Visitor"
    }
    DB.addVehicle(data);
    res.redirect('/userDash')
});

app.post('/emp', function (req, res) {
    req.session.compSelect = req.body.compSelect;
    res.redirect('/add/employee');
});

app.get('/add/employee/:comp/:name', function (req, res) {
    let empData = DB.fetchEmp(req.params.comp,req.params.name);
    res.render('employeeAdd', {
        title: 'Employee Addmission',
        layouts: 'main',
        name: empData[0].NameInfo,
        reg: empData[0].VehicleReg,
        comp: empData[0].CompanyGroup,
        data: empData[0].VehicleType,
        helpers: {
            selected(value, data) {
                if (value == data) {
                    return 'checked'
                } else {
                    return ''
                }
            }
        }
    })
});

app.post('/empAdd', function (req, res) {
    let data = {
        id: uuid().toString(),
        DateOfEntry: moment().format("DD-MM-YY"),
        TimeOfEntry: moment().format('hh:mm:ss A'),
        NameInfo: req.body.name,
        VehicleReg: req.body.vehicleReg,
        VehicleType: req.body.type,
        AddGroup: "Employee"
    }
    DB.addVehicle(data);
    res.redirect('/userDash')
});

app.get('/userDash', function (req, res) {
    let data = DB.fetchData();
    let list = data.map(
        function (item) {
            return {
                name: item.NameInfo,
                date: item.DateOfEntry,
                time: item.TimeOfEntry,
                type: item.VehicleType,
                reg: item.VehicleReg
            }
        });
    console.log(list);
    res.render('userDashboard', {
        title: "List",
        layouts: 'main',
        vehicle: list
    });
})

app.post('/transporter', function (req, res) {
    let group;
    if(req.body.type == 'other'){
        group = req.body.purpose;
    } else {
        group = req.body.type;
    };
    let data = {
        id: uuid().toString(),
        DateOfEntry: moment().format("DD-MM-YY"),
        TimeOfEntry: moment().format('hh:mm:ss A'),
        NameInfo: req.body.name,
        VehicleReg: req.body.vehicleReg,
        VehicleType: 'Truck',
        AddGroup: group
    }
    DB.addVehicle(data);
    res.redirect('/userDash')
});



const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App started at port:' + PORT);
});
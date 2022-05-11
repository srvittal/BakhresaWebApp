const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');


const saltRounds = 10;

const db = new Database('BSA.db');

db.exec('CREATE TABLE if not exists user_login (id INTEGER PRIMARY KEY AUTOINCREMENT, AccType TEXT NOT NULL, Username TEXT NOT NULL,Pwd TEXT NOT NULL)');
db.exec('CREATE TABLE if not exists vehicle_present (id TEXT PRIMARY KEY, DateOfEntry TEXT NOT NULL, TimeOfEntry TEXT NOT NULL, NameInfo TEXT NOT NULL, VehicleReg TEXT NOT NULL, VehicleType TEXT NOT NULL, AddGroup TEXT NOT NULL)');
db.exec('CREATE TABLE if not exists vehicle_history (id TEXT PRIMARY KEY, DateOfEntry TEXT NOT NULL, TimeOfEntry TEXT NOT NULL, NameInfo TEXT NOT NULL, VehicleReg TEXT NOT NULL, VehicleType TEXT NOT NULL, AddGroup TEXT NOT NULL, DateOfExit TEXT , TimeOfExit TEXT )');
db.exec('CREATE TABLE if not exists employeeList (id INTEGER PRIMARY KEY AUTOINCREMENT, CompanyGroup TEXT NOT NULL, NameInfo TEXT NOT NULL, VehicleReg TEXT NOT NULL, VehicleType TEXT NOT NULL)');

module.exports = function dataBase() {
    function userExists(Username, type) {
        if (type == 'user') {
            const userFetchString = db.prepare('SELECT * FROM user_login WHERE Username = ?');
            let userDetails = userFetchString.all(Username);
            if (userDetails.length == 0) {
                return true;
            } else {
                return false;
            }
        } else if (type == 'emp') {
            const empFetchString = db.prepare('SELECT * FROM employeeList WHERE NameInfo = ? AND CompanyGroup = ?');
            let empDetails = empFetchString.all(Username.NameInfo, Username.CompanyGroup);
            if (empDetails.length == 0) {
                return true;
            } else {
                return false;
            }
        }
    };

    function addUser(AccType, Username, Password) {
        if (userExists(Username, 'user') == true) {
            const hashPwd = bcrypt.hashSync(Password, saltRounds);
            const userAddString = db.prepare('INSERT INTO user_login (AccType, Username, Pwd) VALUES ($AccType, $Username, $Pwd);');
            userAddString.run({
                AccType: AccType,
                Username: Username,
                Pwd: hashPwd
            });
        } else {
            throw 'Username already exists'
        }
    };

    function getUser(Username) {
        const userFetchString = db.prepare('SELECT * FROM user_login WHERE Username = ?;');
        let userDetails = userFetchString.all(Username);

        return userDetails;
    };

    function addVehicle(data) {
        const addToPresent = db.prepare('INSERT INTO vehicle_present VALUES ($id,$DateOfEntry,$TimeOfEntry,$NameInfo,$VehicleReg,$VehicleType,$AddGroup);');
        const addToHistory = db.prepare('INSERT INTO vehicle_history (id,DateOfEntry,TimeOfEntry,NameInfo,VehicleReg,VehicleType,AddGroup) VALUES ($id,$DateOfEntry,$TimeOfEntry,$NameInfo,$VehicleReg,$VehicleType,$AddGroup);');

        addToPresent.run({
            id: data.id,
            DateOfEntry: data.DateOfEntry,
            TimeOfEntry: data.TimeOfEntry,
            NameInfo: data.NameInfo,
            VehicleReg: data.VehicleReg,
            VehicleType: data.VehicleType,
            AddGroup: data.AddGroup
        });
        addToHistory.run({
            id: data.id,
            DateOfEntry: data.DateOfEntry,
            TimeOfEntry: data.TimeOfEntry,
            NameInfo: data.NameInfo,
            VehicleReg: data.VehicleReg,
            VehicleType: data.VehicleType,
            AddGroup: data.AddGroup,
        });
    };

    function exitVehicle(id, VehicleReg, DateOfExit, TimeOfExit) {
        const deletePresent = db.prepare('DELETE FROM vehicle_present WHERE id = ? AND VehicleReg = ?;');
        const updateHistory = db.prepare('UPDATE vehicle_history SET DateOfExit = ?, TimeOfExit= ? WHERE id = ? AND VehicleReg = ?;');

        deletePresent.run(id, VehicleReg);
        updateHistory.run(DateOfExit, TimeOfExit, id, VehicleReg);
    };

    function employees(action, data, updateVar) {
        if (action == 'add') {
            const addEmp = db.prepare('INSERT INTO employeeList (CompanyGroup, NameInfo, VehicleReg, VehicleType) VALUES ($CompanyGroup,$NameInfo,$VehicleReg,$VehicleType);');

            let info = {
                NameInfo: data.NameInfo,
                CompanyGroup: data.CompanyGroup
            };
            if (userExists(info, 'emp') == true) {
                addEmp.run({
                    CompanyGroup: data.CompanyGroup,
                    NameInfo: data.NameInfo,
                    VehicleReg: data.VehicleReg,
                    VehicleType: data.VehicleType
                });
            } else {
                throw 'Employee already exists'
            }
        } else if (action == 'update') {
            const updateEmp = db.prepare('UPDATE employeeList SET' + updateVar + '= ? WHERE NameInfo = ?;');

            updateEmp.run(data.updateVal, data.NameInfo)
        } else if (action == 'delete') {
            const deleteEmp = db.prepare('DELETE FROM employeeList WHERE CompanyGroup = ? AND NameInfo = ?;');

            deleteEmp.run(data.CompanyGroup, data.NameInfo)
        }
    }

    function fetchData() {

        const Present = db.prepare('SELECT * FROM vehicle_present');
        let details = Present.all();

        return details;
    };

    function fetchEmp(comp, name) {
        if (arguments.length == 1) {
            const emp = db.prepare('SELECT * FROM employeeList WHERE CompanyGroup = ?');
            let details = emp.all(comp);

            return details;
        } else {
            const emp = db.prepare('SELECT * FROM employeeList WHERE CompanyGroup = ? AND NameInfo = ?');
            let details = emp.all(comp,name);

            return details;
        }
    }

    return {
        addUser,
        getUser,
        addVehicle,
        exitVehicle,
        employees,
        fetchData,
        fetchEmp
    }
}


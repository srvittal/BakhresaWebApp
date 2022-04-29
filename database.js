const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');


const saltRounds = 10;

const db = new Database('BSA.db');

db.exec('CREATE TABLE if not exists user_login (id INTEGER PRIMARY KEY AUTOINCREMENT, AccType TEXT NOT NULL, Username TEXT NOT NULL,Pwd TEXT NOT NULL)');
db.exec('CREATE TABLE if not exists vehicle_present (id TEXT PRIMARY KEY, DateOfEntry TEXT NOT NULL, TimeOfEntry TEXT NOT NULL, NameInfo TEXT NOT NULL, VehicleReg TEXT NOT NULL, AddGroup TEXT NOT NULL)');
db.exec('CREATE TABLE if not exists vehicle_history (id TEXT PRIMARY KEY, DateOfEntry TEXT NOT NULL, TimeOfEntry TEXT NOT NULL, NameInfo TEXT NOT NULL, VehicleReg TEXT NOT NULL, AddGroup TEXT NOT NULL, DateOfExit TEXT , TimeOfExit TEXT )');

module.exports = function dataBase() {
    function userExists(Username) {
        const userFetchString = db.prepare('SELECT * FROM user_login WHERE Username = ?');
        let userDetails = userFetchString.all(Username);
        if (userDetails.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    function addUser(AccType, Username, Password) {
        if (userExists(Username) == true) {
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
    }

    function addVehicle(data) {
        const addToPresent = db.prepare('INSERT INTO vehicle_present VALUES ($id,$DateOfEntry,$TimeOfEntry,$NameInfo,$VehicleReg,$AddGroup);');
        const addToHistory = db.prepare('INSERT INTO vehicle_history (id,DateOfEntry,TimeOfEntry,NameInfo,VehicleReg,AddGroup) VALUES ($id,$DateOfEntry,$TimeOfEntry,$NameInfo,$VehicleReg,$AddGroup);');
        
        addToPresent.run({
            id: data.id,
            DateOfEntry: data.DateOfEntry,
            TimeOfEntry: data.TimeOfEntry,
            NameInfo: data.NameInfo,
            VehicleReg: data.VehicleReg,
            AddGroup: data.AddGroup
        });
        addToHistory.run({
            id: data.id,
            DateOfEntry: data.DateOfEntry,
            TimeOfEntry: data.TimeOfEntry,
            NameInfo: data.NameInfo,
            VehicleReg: data.VehicleReg,
            AddGroup: data.AddGroup,
            DateOfExit: data.DateOfEntry,
            TimeOfExit: data.TimeOfEntry
        });
    }

    function exitVehicle(id, VehicleReg, DateOfExit, TimeOfExit) {
        const deletePresent = db.prepare('DELETE FROM vehicle_present WHERE id = ? AND VehicleReg = ?;');
        const updateHistory = db.prepare('UPDATE vehicle_history SET DateOfExit = ?, TimeOfExit= ? WHERE id = ? AND VehicleReg = ?;');

        deletePresent.run(id, VehicleReg);
        updateHistory.run(DateOfExit, TimeOfExit, id, VehicleReg);

    }

    function fetchData(){
        const Present = db.prepare('SELECT * FROM vehicle_present');
        let details = Present.all();

        

        console.log(details)
        return details;
    }

    return {
        addUser,
        getUser,
        addVehicle,
        exitVehicle,
        fetchData
    }
}


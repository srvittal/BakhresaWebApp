const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');


const saltRounds = 10;

const db = new Database('BSA.db');

db.exec('CREATE TABLE if not exists user_login (id INTEGER PRIMARY KEY AUTOINCREMENT, AccType TEXT NOT NULL, Username TEXT NOT NULL,Pwd TEXT NOT NULL)');

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
            const userAddString = db.prepare('INSERT INTO user_login (AccType, Username, Pwd) VALUES (?, ?, ?)');
            userAddString.run(AccType, Username, hashPwd);
        } else {
            throw 'Username already exists'
        }
    };

    function getUser(Username) {
        const userFetchString = db.prepare('SELECT * FROM user_login WHERE Username = ?');
        let userDetails = userFetchString.all(Username);

        return userDetails;
    }

    return {
        addUser,
        getUser
    }
}


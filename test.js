const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

module.exports = function dataBase() {
    open({
        filename: './log_database.db',
        driver: sqlite3.Database
    }).then(async function (db) {

        async function add() {
            await db.run('INSERT INTO user_login(AccType,Username,Pwd) VALUES (?, ?, ?)', 'admin', 'suda', '123');
        }

        async function fetch() {
            await db.all('SELECT * FROM user_login')
                .then(function (db) {
                    console.log(db)
                });
        }

        return {
            add,
            fetch
        }

    });
}

// const customerCreateSQL = 'INSERT INTO customer(Session_Code, Username) VALUES (?, ?)';
// const createOrderSQL = 'UPDATE customer SET Order_Date = ?, Order_Time = ?, Small_Pizza = ?, Med_Pizza = ?, Large_Pizza = ?, Cart_Total = ?, Order_Status = ? WHERE Session_Code = ?';

// await db.run(customerCreateSQL, req.session.id, req.session.userName);
// await db.run(createOrderSQL, dateNow, timeNow, cart.qtyUpdate().smallQty, cart.qtyUpdate().medQty, cart.qtyUpdate().largeQty, req.session.cartTotal, 'Payment Due', req.session.id);
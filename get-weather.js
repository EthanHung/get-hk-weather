const http = require('http');
const https = require('https');
const mysql = require('mysql');

const con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin"
});

function connectToDb(callback) {
    con.getConnection(function (err) {
        if (err) throw err;
        console.log("Connected!");

        con.query('CREATE DATABASE IF NOT EXISTS `mydb`', (err, result) => {
            if (err) throw err;
            console.log("Database created");

//            con.query('use `mydb`; CREATE TABLE IF NOT EXISTS `hk_weather` (\n' +
//                '   `id` VARCHAR(40) NOT NULL DEFAULT \'0\',\n' +
//                '   `weather` json NOT NULL,\n' +
//                '   `create_datetime` VARCHAR(16) NOT NULL DEFAULT \'0\',\n' +
//                '   `last_update_datetime` VARCHAR(50) NOT NULL,\n' +
//                '   `status` TINYINT(4) NOT NULL DEFAULT \'0\'\n' +
//                ')', (err, result) => {

            con.query('use `mydb`', (err, result) => {

                con.query('CREATE TABLE MyGuests (\n' +
                    'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n' +
                    'firstname VARCHAR(30) NOT NULL,\n' +
                    'lastname VARCHAR(30) NOT NULL,\n' +
                    'email VARCHAR(50),\n' +
                    'reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n' +
                    ')', (err, result) => {
                    if (err) throw err;
                    console.log("Database created");
                    con.release();
                });
            });
        });

        callback()
    });
}

function setResponse(res, result) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 3));
}

const app = http.createServer(function (req, res) {
    let result = null;
    connectToDb(() => {
        https.get('https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&id=1819729&units=metric', (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
//                con.query('INSERT INTO customers (name, address) VALUES (\'Company Inc\', \'Highway 37\')"', (err, result) => {
//                    if (err) throw err;
//                    console.log("Result: " + result);
//                    setResponse(res, result);
//                });
                setResponse(res, JSON.parse(data));
            });

        }).on('error', (err) => {
            console.log('Error: ' + err.message);
//            con.query('select * from hk_weather order by create_datetime desc limit 1', (err, result) => {
//                if (err) throw err;
//                console.log("Result: " + result);
//                setResponse(res, result);
//            });
        });
    });
});
app.listen(8083);



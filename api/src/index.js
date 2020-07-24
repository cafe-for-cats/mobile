const express = require('express');
const mysql = require('mysql');

const app = express();

app.get('/', function(req, res) {
  res.send('Hello World' + process.env.DEBUG);
});

app.get('/pins', function(req, res) {
  var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'sa',
    password: 'yJRxqg7mFf68waeJoibh',
    database: 'master'
  });

  connection.connect();

  connection.query('SELECT * FROM PINS', function(err, rows, fields) {
    if (err) res.send(err);

    res.send(rows[0]);
  });

  connection.end();
});

app.listen(3000);

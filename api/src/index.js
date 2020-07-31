const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World' + process.env.DEBUG);
});

// #region PINS
/**
 * GET all Pins
 */
app.get('/pins', (req, res) => {
  var connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query('SELECT * FROM PINS', (err, rows, fields) => {
    if (err) res.send(err);

    res.send(rows);
  });

  connection.end();
});

/**
 * GET a Pin by it's Id
 * @param pinId
 */
app.get('/pins/:pinId', (req, res) => {
  const { pinId } = req.params;
  var connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query(
    `SELECT * FROM PINS WHERE PIN_ID='${pinId}'`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});
// #endregion

// #region USERS
/**
 * GET all Users
 */
app.get('/users', (req, res) => {
  var connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query('SELECT * FROM USERS', (err, rows, fields) => {
    if (err) res.send(err);

    res.send(rows);
  });

  connection.end();
});

/**
 * GET a User by it's Id
 * @param userId
 */
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  var connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query(
    `SELECT * FROM USERS WHERE USER_ID='${userId}'`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});

app.post('/pins', (req, res) => {
  const { pinId, userId, longitude, latitude, label, createDate } = req.body;

  var connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query(
    `INSERT INTO PINS(PIN_ID, USER_ID, LATITUDE, LONGITUDE, LABEL, CREATE_DATE)
    VALUES(UUID(), ${userId}, ${longitude}, ${latitude}, ${label}, ${createDate})`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});
// #endregion

app.listen(3000);

const express = require('express');
const mysql = require('mysql');

const app = express();
const bodyParser = require('body-parser');

const { host, port, user, password, database } = {
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'master'
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World' + process.env.DEBUG);
});

// #region PINS
/**
 * GET all Pins
 * @returns An array of Pins
 */
app.get('/pins', (req, res) => {
  const query = 'SELECT * FROM PINS';

  const connection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database
  });

  connection.connect();

  connection.query(query, (err, rows, fields) => {
    if (err) res.send(err);

    res.send(rows);
  });

  connection.end();
});

/**
 * GET a Pin by it's Id
 * @param pinId
 * @returns A Pin meeting the specified criteria
 */
app.get('/pins/:pinId', (req, res) => {
  const { pinId } = req.params;

  const connection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database
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

/**
 * POST a PIN
 * @param userId Id of the User associated to this Pin
 * @param longitude The longitude of the location for this Pin
 * @param latitude The latitude of the location for this Pin
 * @param label The Pin's label
 * @returns The created Pin
 */
app.post('/pins', (req, res) => {
  const { userId, longitude, latitude, label } = req.body;

  const connection = mysql.createConnection({
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

// #endregion PINS

// #region USERS
/**
 * GET all Users
 * @returns An array of Users
 */
app.get('/users', (req, res) => {
  const connection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database
  });

  connection.connect();

  connection.query('SELECT * FROM USERS', (err, rows, fields) => {
    if (err) res.send(err);

    res.send(rows);
  });

  connection.end();
});

/**
 * GET a User by their Id
 * @param userId
 * @returns A User meeting the specified criteria
 */
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  const connection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database
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

/**
 * POST a User
 * @param userId
 * @returns The created User
 */
app.post('/users', (req, res) => {
  const { userId } = req.body;

  const connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query(
    `INSERT INTO PINS(USER_ID)
    VALUES(${userId})`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});
// #endregion

app.listen(3000);

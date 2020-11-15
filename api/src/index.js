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

// TODO: Better implementation of this, plus fix the hardcoded port number
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World' + process.env.DEBUG);
});

// #region pins
app.get('/pins', (req, res) => {
  const query = 'SELECT * FROM pins';

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
    `SELECT * FROM pins WHERE pin_id='${pinId}'`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});

app.post('/pins', (req, res) => {
  const { userId, longitude, latitude, label } = req.body;
  const createDate = new Date();

  const connection = mysql.createConnection({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'master'
  });

  connection.connect();

  connection.query(
    `INSERT INTO pins(pin_id, user_id, latitude, longitude, label, create_date)
    VALUES(UUID(), ${userId}, ${longitude}, ${latitude}, '${label}', '1000-01-01 00:00:00')`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});

// #endregion pins

// #region users
app.get('/users', (req, res) => {
  const connection = mysql.createConnection({
    host,
    port,
    user,
    password,
    database
  });

  connection.connect();

  connection.query('SELECT * FROM users', (err, rows, fields) => {
    if (err) res.send(err);

    res.send(rows);
  });

  connection.end();
});

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
    `SELECT * FROM users WHERE user_id='${userId}'`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});

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
    `INSERT INTO pins(user_id)
    VALUES(${userId})`,
    (err, rows, fields) => {
      if (err) res.send(err);

      res.send(rows);
    }
  );

  connection.end();
});
// #endregion users

app.listen(3000);

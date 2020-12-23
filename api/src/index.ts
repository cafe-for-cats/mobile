import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connect } from './config/dbConnection';

const app = express();

connect();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  //Import the mongoose module

  //Set up default mongoose connection
  var mongoDB = 'mongodb://127.0.0.1/my_database';
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  //Get the default connection
  var db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  res.status(200).send('Hello World!');
});

app.listen(8000, () => {
  console.log('Server Started at Port, 8000');
});

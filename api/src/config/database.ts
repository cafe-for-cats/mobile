import { ConnectionOptions, connect, mongo } from 'mongoose';

/**
 * Attempt to establish a connection to the database based on `process.env.MONGO_URI`.
 */
const connectDB = async () => {
  try {
    const mongoURI: string = process.env.MONGO_URI || '';

    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    };

    await connect(
      mongoURI,
      options
    );

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err.message);
    console.log('Trying again...');

    process.exit(1); // Exit after several restries to connect to MongoDB
  }
};

export default connectDB;

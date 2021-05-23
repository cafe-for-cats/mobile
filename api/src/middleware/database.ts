import { ConnectionOptions, connect } from 'mongoose';

/**
 * Attempt to establish a connection to the database.
 */
const connectDB = async () => {
  try {
    const mongoURI: string = process.env.MONGO_URI || '';

    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };

    await connect(mongoURI, options);

    console.log('✔️  MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err.message);

    process.exit(1);
  }
};

export default connectDB;

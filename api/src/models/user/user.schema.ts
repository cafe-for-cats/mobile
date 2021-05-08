import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  username: String,
  password: String,
  associatedProtests: [String],
});

export default mongoose.model('users', schema);

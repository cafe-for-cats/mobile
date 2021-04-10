import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  username: String,
  password: String,
  createDate: Date,
  accessLevels: [String],
});

const User = model('User', schema);

export default User;

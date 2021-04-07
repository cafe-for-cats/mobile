import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  username: String,
  password: String,
  accessLevel: String,
  createDate: Date,
});

const User = model('User', schema);

export default User;

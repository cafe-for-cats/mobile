import { model, Schema } from 'mongoose';

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  password: String,
  createDate: Date,
  associatedProtests: [
    {
      protestId: Schema.Types.ObjectId,
      accessLevel: Number,
      isCreator: Boolean,
    },
  ],
});

const User = model('User', schema);

export default User;

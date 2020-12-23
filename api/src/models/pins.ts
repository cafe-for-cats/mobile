import { Schema } from 'mongoose';
const UserSchema = new Schema({
  id: Schema.Types.ObjectId
});

const TrackableSchema = new Schema({
  createDate: Date,
  isSoftDeleted: Boolean
});

const PinSchema = new Schema({
  id: Schema.Types.ObjectId,
  user: UserSchema,
  trackableSchema: TrackableSchema,
  imageUrl: String
});

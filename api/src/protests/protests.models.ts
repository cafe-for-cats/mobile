import { model, Schema } from 'mongoose';

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  description: String,
  startDate: Date,
  /** Duration in minutes. */
  duration: Number,
  associatedUsers: [Object],
  shareToken: Object,
});

const Protest = model('Protest', schema);

export default Protest;

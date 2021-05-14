import { model, Schema } from 'mongoose';

const schema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  description: String,
  startDate: Date,
  associatedUserIds: [Schema.Types.ObjectId],
});

const Protest = model('Protest', schema);

export default Protest;

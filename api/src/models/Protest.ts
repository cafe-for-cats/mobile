import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  shareUrls: {
    leaderUrlId: Schema.Types.ObjectId,
    organizerUrlId: Schema.Types.ObjectId,
    attendeeUrlId: Schema.Types.ObjectId,
  },
  users: [
    {
      id: String,
      accessLevels: [String],
    },
  ],
});

const Protest = model('Protest', schema);

export default Protest;

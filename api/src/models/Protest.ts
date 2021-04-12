import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  shareUrls: {
    leaderUrl: String,
    organizerUrl: String,
    attendeeUrl: String,
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

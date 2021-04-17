import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  shareUrls: {
    leaderUrlId: String,
    organizerUrlId: String,
    attendeeUrlId: String,
  },
  creatorId: Schema.Types.ObjectId,
  users: [
    {
      id: String,
      accessLevels: [String],
    },
  ],
});

interface Protest {
  id: string;
  title: string;
  shareUrls: {
    leaderUrlId: string;
    organizerUrlId: string;
    attendeeUrlId: string;
  };
  users: [
    {
      id: string;
      accessLevels: [string];
    }
  ];
}

const Protest = model('Protest', schema);

export default Protest;

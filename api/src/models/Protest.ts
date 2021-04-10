import { model, Schema } from 'mongoose';
import User from './User';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  shareUrls: {
    leaderUrl: String,
    organizerUrl: String,
    attendeeUrl: String,
  },
  users: [User],
});

const Protest = model('Protest', schema);

export default Protest;

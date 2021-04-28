import { model, Schema } from 'mongoose';

const schema = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  description: String,
  zipcode: String,
  shareUrls: [
    {
      id: Schema.Types.ObjectId,
      accessLevelCategory: String,
    },
  ],
  associatedUsers: [
    {
      id: String,
      accessLevel: String,
      isCreator: Boolean,
    },
  ],
});

interface Protest {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  associatedUsers: { _id: string; accessLevel: string }[];
}

const Protest = model('Protest', schema);

export default Protest;

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
  creatorId: Schema.Types.ObjectId,
  associatedUsers: [
    {
      id: String,
      accessLevels: [String],
    },
  ],
});

interface Protest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  shareUrls: [
    {
      id: String;
      type: String;
    }
  ];
  users: [
    {
      id: string;
      accessLevels: [string];
    }
  ];
}

const Protest = model('Protest', schema);

export default Protest;

import { Document, Model, model, Schema } from 'mongoose';

export interface IPin extends Document {
  id?: string;
  label: String;
  showOnMap: Boolean;
  imageUrl: String;
  trackable: {
    userId: Number;
    createDate: Date;
  };
  position: {
    lat: Number;
    lng: Number;
  };
}

const pinSchema: Schema = new Schema({
  id: Schema.Types.ObjectId,
  label: String,
  showOnMap: Boolean,
  imageUrl: String,
  trackable: {
    userId: Number,
    createDate: Date
  },
  position: {
    lat: Number,
    lng: Number
  }
});

const Pin: Model<IPin> = model('Pin', pinSchema);

export default Pin;

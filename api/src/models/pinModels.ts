import { Document, Model, model, Schema } from 'mongoose';

export interface IPin extends Document {
  id?: string;
  userId: Number;
  label: String;
  showOnMap: Boolean;
  imageUrl: String;
  createDate: Date;
}

const pinSchema: Schema = new Schema({
  id: Schema.Types.ObjectId,
  userId: Number,
  label: String,
  showOnMap: Boolean,
  imageUrl: String,
  createDate: Date
});

const Pin: Model<IPin> = model('Pin', pinSchema);

export default Pin;

import { Document, Model, model, Schema } from 'mongoose';

export interface IPin extends Document {
  id: string;
  label: string;
}

const pinSchema: Schema = new Schema({
  id: Schema.Types.ObjectId,
  label: String
});

const Pin: Model<IPin> = model('Pin', pinSchema);

export default Pin;

import { model, Schema } from 'mongoose';

const pinSchema = new Schema({
  id: Schema.Types.ObjectId,
  label: String,
  showOnMap: Boolean,
  imageUrl: String,
  trackable: {
    userId: Number,
    createDate: Date,
  },
  position: {
    lat: Number,
    lng: Number,
  },
});

const Pin = model('Pin', pinSchema);

export default Pin;

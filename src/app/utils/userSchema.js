import { model, models, Schema  } from "mongoose";

const userSchema = new Schema({
    uid: { type: String, required: true, unique: true },
  displayName: String,
  email: String,
  photoURL: String,
  history: {type:Array,default:[]},
})
const User = models.user || model('user', userSchema);
export default User;
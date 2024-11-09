import { model, models, Schema  } from "mongoose";

const userSchema = new Schema({
    username : {type: String, required: true},
    emailID : {type: String, required: true},
    password : {type: Number, required: true},
    History : {type: Array, required: true},
})
const User = models.user || model('user', userSchema);
export default User;
export {};
import * as mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 3,
  },
  memes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meme",
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("user", userSchema);

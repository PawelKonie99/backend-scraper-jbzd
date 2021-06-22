export {};
import * as mongoose from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

const memeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
    unique: true,
  },
  website: {
    type: String,
    required: true,
  },
  buffer: {
    type: Buffer,
  },
  mimeType: {
    type: String,
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

memeSchema.plugin(uniqueValidator);

memeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("meme", memeSchema);

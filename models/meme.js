const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const memeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
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

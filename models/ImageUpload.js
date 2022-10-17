const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({
  name: String,
  desc: {
    type: String,
    default: "",
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const ImageUpload = model("imageupload", ImageSchema);
module.exports = ImageUpload;

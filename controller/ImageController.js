const ImageUpload = require("../models/ImageUpload");
const CircularJSON = require("circular-json");
const fs = require("fs");
const path = require("path");

module.exports.ImageUpload = async (req, res, next) => {
  console.log(req.files);
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
      contentType: "image/png",
    },
  };
  const image = new ImageUpload(obj);

  await image.save().then(function (result) {
    res.send(result);
  });
};

module.exports.getImage = async (req, res, next) => {
  const getImage = await ImageUpload.findOne({ _id: "634d08edcadb16b1fc0d7b0d" });

  console.log("getImage", getImage);

  //   const circularData = CircularJSON.stringify(getImage);
  //   console.log("getImage", circularData.name);
  //   res.set("Content-Type", "image/png");
  //   console.log(CircularJSON.parse(circularData));
  res.json(getImage.img.data);
};

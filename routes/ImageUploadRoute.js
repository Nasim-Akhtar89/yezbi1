const ImageRoute = require("express").Router();
var fs = require("fs");
const multer = require("multer");
const path = require("path");
const ImageUpload = require("../models/ImageUpload");

const { getImage } = require("../controller/ImageController");

var storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     console.log(" sv =======");
  //     cb(null, path.resolve(__dirname, "./uploads"));
  //   },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

ImageRoute.post("/upload/image", async (req, res, next) => {
  console.log(req.files.image);
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: req.files.image.data,
      contentType: `${req.files.image.mimetype}`,
    },
  };
  const image = new ImageUpload(obj);

  await image.save().then(function (result) {
    res.send(result);
  });
  //   res.send("processing");
});
ImageRoute.post("/upload/image/get", getImage);

module.exports = ImageRoute;

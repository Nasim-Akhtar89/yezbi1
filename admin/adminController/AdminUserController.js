const ProfileCard = require("../../models/ProfileCard");

const { Parser } = require("json2csv");

module.exports.getAllUsers = async (req, res) => {
  const { premium, cardCount, dateFrom, dateTo, getCsvData } = req.body;
  console.log("premium", premium, cardCount);
  let queryObject = {};
  if (premium == undefined && cardCount == undefined) {
    console.log("condition 1");
    queryObject = {};
  } else if ((premium == false || premium == true) && !cardCount) {
    console.log("condition 2");
    queryObject = {
      premium: premium,
    };
  } else if (!premium && (cardCount == 0 || cardCount > 0)) {
    console.log(cardCount + " cards");
    console.log("condition 3");
    queryObject = {
      cardCount: cardCount > 0 ? { $gt: 0 } : 0,
    };
  } else {
    console.log("no condition");
  }

  if (dateFrom && dateTo) {
    queryObject = { ...queryObject, createdAt: { $gte: dateFrom, $lt: dateTo } };
  }

  console.log("queryObject", queryObject);
  await ProfileCard.find(queryObject)
    .select("name email shortUserId")
    .then((user) => {
      if (user && user.length != 0) {
        console.log(user);
        if (getCsvData == true) {
          const jsonUser = JSON.stringify(user);
          const fields = ["_id", "name", "email", "shortUserId"];
          console.log(jsonUser);
          const jason2csvParser = new Parser({ fields });
          let csv = jason2csvParser.parse(user);
          return res.status(200).send({ message: "All Users", data: user, csvFile: csv });
        }
        return res.status(200).send({ message: "All Users", data: user, csvFile: null });
      } else {
        return res.status(404).send({ message: "No Users Found!" });
      }
    })
    .catch((err) => {
      return res.status(400).send({ message: err.message });
    });
};

// Card count should shift from admin pannel
const fs = require("fs");
module.exports.getUsersCsvData = async (req, res) => {
  await ProfileCard.find()
    .select("name email shortUserId")
    .then((user) => {
      // console.log(user);
      const fields = ["_id", "name", "email", "shortUserId"];
      const jsonUser = JSON.stringify(user);
      // console.log(jsonUser);
      const jason2csvParser = new Parser({ fields });
      const csv = jason2csvParser.parse(user);
      console.log(csv);
      // fs.writeFile("nasim.csv", csv, (err) => {
      //   if (err) {
      //     throw err;
      //   }

      //   console.log("file save well");
      // });
      // res.attachment("nasim.csv");
      return res.status(200).send(csv);
    })
    .catch((err) => console.log(err));
};

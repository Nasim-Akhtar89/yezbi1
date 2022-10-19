const ProfileCard = require("../models/ProfileCard");
const vCardsJS = require("vcards-js");
const ShortUniqueId = require("short-unique-id");
const linksAppSupports = require("../linksAppSupports");

// this function take some parameters and allow you to make V-Card
// resueable
function makeVcard(name, email, number, img, company, jobTitle, note, website) {
  let vCard = vCardsJS();
  let [fName = "", mName = "", lName = ""] = name.split(" ");
  vCard.firstName = fName;
  vCard.middleName = mName;
  vCard.lastName = lName;
  vCard.email = email;
  !!img && vCard.photo.attachFromUrl(img, img.slice(img.length - 5, img.length).split(".")[1]);
  !!company && (vCard.organization = company);
  !!number && (vCard.workPhone = number);
  !!jobTitle && (vCard.title = jobTitle);
  !!note && (vCard.note = note);
  vCard.url;
  !!website && (vCard.url = website);

  // from here, vCard + two headers returned for creating vCard file...
  const sid = new ShortUniqueId({ length: 10 })();
  return {
    vCard: vCard.getFormattedString(),
    contentDisposition: `inline; filename="${sid}.vcf"`,
    contentType: `text/vcard; name="${sid}.vcf"`,
  };
}

module.exports.getProfileCard = async (req, res) => {
  let { sid } = req.params;
  try {
    const { _id, name, email, coverImgUrl, profileImgUrl, theme, location, links, private, businessClient, bio, profileImg, coverImg } =
      await ProfileCard.findOne({
        shortUserId: sid,
      }).select("-connections");

    // console.log("ProfileImg", profileImg);

    const linksFiltered = links.filter(businessClient ? (l) => l.isBusiness && l.visibleOnProfile : (l) => !l.isBusiness && l.visibleOnProfile);
    const zerolinks = !linksFiltered.length;

    res.render("profile-card", {
      linksAppSupports,
      _id,
      name,
      email,
      profileImgUrl,
      coverImgUrl,
      theme,
      location,
      bio,
      links: linksFiltered,
      zerolinks,
      private,
      profileImg,
      coverImg,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.addConnection = async function (req, res) {
  // console.log(req.body);
  let { id = "", name = "", email = "", number = "", jobTitle = "", company = "", note = "", existing_user = false } = req.body;

  // res.json({ ...req.body });
  existing_user = existing_user === "false" || !existing_user ? false : true;

  let errors = [];

  try {
    // here
    if (!id) {
      errors.push("Warning! Don't remove ID attribute.");
      throw new Error();
    }
    if (!email) {
      errors.push("Email is required!");
      throw new Error();
    }
    const usrProfileCard = await ProfileCard.findById(id).select("connections profileImgUrl email name shortUserId");
    if (!usrProfileCard) {
      errors.push("No such user found in Database!");
      errors.push("User may be deleted or removed!");
      throw new Error();
    }
    // making vCard
    if (existing_user) {
      let existingUserData = await ProfileCard.findOne({ email });
      if (!existingUserData) {
        return res.status(404).send("No User found...");
      }
      for (let i = 0; i < usrProfileCard.connections.length; i++) {
        if (usrProfileCard.connections[i].email === email) {
          throw new Error("Connection already exist!");
        }
      }
      usrProfileCard.connections.push({
        name: existingUserData.name,
        email: existingUserData.email,
        imgUrl: existingUserData.profileImgUrl,
      });

      existingUserData.connections.push({
        name: usrProfileCard.name,
        email: usrProfileCard.email,
        imgUrl: usrProfileCard.profileImgUrl,
      });
      await existingUserData.save();
    } else {
      for (let i = 0; i < usrProfileCard.connections.length; i++) {
        if (usrProfileCard.connections[i].email === email) {
          throw new Error("Connection already exist!");
        }
      }
      usrProfileCard.connections.push({
        name,
        email,
        number,
        jobTitle,
        company,
        note,
        imgUrl: "",
      });
      //   existingUserData.connections.push({
      // 	name: usrProfileCard.name,
      //     email: usrProfileCard.email,
      //     imgUrl: usrProfileCard.profileImgUrl,
      //   })
    }

    await usrProfileCard.save();
    // await existingUserData.save();
    // now user is in your connection, send him your vCard too...
    let { vCard, contentType, contentDisposition } = makeVcard(
      usrProfileCard.name,
      usrProfileCard.email,
      "",
      `${req.get("host")}${usrProfileCard.profileImgUrl}`,
      "",
      "",
      "",
      `${req.get("host")}/${usrProfileCard.shortUserId}/share`
    );

    // set returned headers to response
    res.set("Content-Type", contentType);
    res.set("Content-Disposition", contentDisposition);
    res.send(vCard);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors,
      message: err.message,
    });
  }
};

module.exports.userCardCount = async (req, res) => {
  const { email } = req.body;
  if (email === undefined || email === null || email === "") {
    return res.status(400).send({ message: "Please enter a valid email address" });
  } else {
    let userProfileCard = await ProfileCard.findOne({ email: email }).select("cardCount").exec();
    // console.log(userProfileCard);
    if (userProfileCard) {
      userProfileCard.cardCount = userProfileCard.cardCount + 1;
      await userProfileCard
        .save()
        .then((card) => {
          if (card && card.length != 0) {
            // console.log(card);
            return res.status(200).send({ message: "Cards count", data: card.cardCount });
          } else {
            return res.status(404).send({ message: "No Card Found!" });
          }
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    } else {
      return res.status(404).send({ message: "No Card Found!" });
    }
  }
};

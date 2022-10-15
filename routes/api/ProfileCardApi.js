const profileAuthRoute = require("express").Router();
const {
  userProfileCardCreation,
  userProfileImageData,
  userCoverImageData,
  userProfileData,
  storeLink,
  updateLink,
  updateEditProfile,
  toggleProfileVisibility,
  toggleLinkVisibility,
  deleteLink,
  deleteConnection,
  getConnection,
  togglePrivateMode,
} = require("../../controller/ProfileCardController");
const { decodeToken, matchEmail } = require("../../middlewares");

// profileAuthRoute.use(decodeToken);
// profileAuthRoute.use(matchEmail);

// POST ROUTES
profileAuthRoute.post("/create/profile-card", userProfileCardCreation);
profileAuthRoute.post("/store/data/profile-image", userProfileImageData);
profileAuthRoute.post("/store/data/cover-image", userCoverImageData);

profileAuthRoute.post("/get/data/all", userProfileData);

profileAuthRoute.post("/store/link", storeLink);
profileAuthRoute.post("/update/link", updateLink);

profileAuthRoute.post("/update/profile", updateEditProfile);

profileAuthRoute.post("/toggle/profile-visibility", toggleProfileVisibility);
profileAuthRoute.post("/toggle/link-visibility", toggleLinkVisibility);

profileAuthRoute.post("/link/delete", deleteLink);

profileAuthRoute.post("/connection/delete", deleteConnection);
profileAuthRoute.post("/connection/get", getConnection);

profileAuthRoute.post("/toggle/privateMode", togglePrivateMode);

module.exports = profileAuthRoute;

/*
void main() {
 var userDetails = {
   'name': "Admin",
   'pass': 'admin123',
   'id': "980a765b0c",
   "address": "unknown..."
 };
  
//   var testUser = { ...userDetails, "name": 'Muhammad Awais' };
  
  var testUser = {
    "name": 'Muhammad Awais',
    'pass': userDetails['pass'],
    'id': userDetails['id'],
    'address': userDetails['address'],
  };
  
  print(userDetails);
  print(testUser);
}
*/

const express = require("express");

const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/login", userController.login);

router.use(checkAuth); // every route after this requires an token

router.post("/addUser", userController.createUser); //Will create a "user" based on username, will set password to LastName, FirstName, no spaces until they sign in the first time

router.patch(
  "/:uid/info/photo",
  fileUpload.single("image"),
  userController.photoUpload
);

router.patch("/info/preferences", userController.updatePreferences);

router.get("/info/preferences", userController.getPreferences);

module.exports = router;

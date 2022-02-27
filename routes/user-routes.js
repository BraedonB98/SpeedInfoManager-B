const express = require("express");

const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/login", userController.login);

router.use(checkAuth); // every route after this requires an token

router.post("/createuser", userController.createUser); //I dont want a user to be able to create a profile unless they are an admin

router.patch(
  "/:uid/info/photo",
  fileUpload.single("image"),
  userController.photoUpload
);

router.patch("/info/preferences", userController.updatePreferences);

router.get("/info/preferences", userController.getPreferences);

module.exports = router;

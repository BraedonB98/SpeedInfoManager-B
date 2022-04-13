const express = require("express");

const storeController = require("../controllers/store-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth); // every route after this requires an token

router.post("/createStore", storeController.createStore);

router.patch("/Store/:sid", storeController.editStore);

router.delete("/Store/:sid", storeController.deleteStore);

router.get("/store/:sid", storeController.getStore);

module.exports = router;

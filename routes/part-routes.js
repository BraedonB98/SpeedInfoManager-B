const express = require("express");

const partController = require("../controllers/part-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
//router.patch("/importParts", partController.importPart);//uncomment when importing parts with postman

router.use(checkAuth); // every route after this requires an token

router.post("/", partController.createPart); //starts new count

router.patch("/part", partController.editPart); //sets item count and returns next part in count if the part has already been counted update that part count and return next item

router.delete("/part", partController.deletePart); //removes entire count item

router.get("/:pid", partController.getPart); //gets specific count by id

module.exports = router;

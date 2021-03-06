const express = require("express");

const inventoryController = require("../controllers/inventory-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.use(checkAuth); // every route after this requires an token

router.post("/count/", inventoryController.createCount); //starts new count

router.patch("/countNext", inventoryController.countNext); //sets item count and returns next part in count if the part has already been counted update that part count and return next item

router.patch("/count", inventoryController.editEntireCount); //manager only, edit entire count item

router.patch("/closeCount", inventoryController.closeCount);

router.delete("/count", inventoryController.deleteCount); //removes entire count item

router.get("/postpone", inventoryController.postponeCount); //takes item out of to Count and adds it to postpone array

//count/complete, Will generate excel file, add store that the count belongs to, ext, Emails user a copy of finished excel document

router.patch("/undoCount", inventoryController.undoCount); //undoes the last nextCount submitted

router.get("/:cid", inventoryController.getCount); //gets specific count by id

module.exports = router;

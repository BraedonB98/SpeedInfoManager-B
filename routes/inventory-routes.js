const express = require("express");

const inventoryController = require("../controllers/uid-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.use(checkAuth); // every route after this requires an token

router.post("/count", inventoryController.setCount); //starts new count

router.patch("/count/item", inventoryController.countNext); //sets item count and returns next part in count

router.patch("/count", inventoryController.editEntireCount); //manager only, edit entire count item

router.delete("/count", inventoryController.deleteCount); //removes entire count item

router.get("/count/postpone", inventoryController.postpone); //takes item out of to Count and adds it to postpone array

router.get("/count/:cid", inventoryController.getCount); //gets specific count by id

module.exports = router;

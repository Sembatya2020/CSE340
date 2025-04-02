// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by single vehicle view
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInventoryId));
// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Add required validation module
const invValidate = require("../utilities/inventory-validation")

// Routes for classification management
router.get(
  "/add-classification", 
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Routes for inventory management
router.get(
  "/add-inventory", 
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router;
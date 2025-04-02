const regValidate = require('../utilities/account-validation')
const { loginValidationRules } = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  loginValidationRules,
  utilities.handleErrors(accountController.processLogin)
)

module.exports = router
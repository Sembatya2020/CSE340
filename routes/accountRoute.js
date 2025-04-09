const regValidate = require('../utilities/accountValidation')
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const { checkLogin, checkAdmin } = require("../utilities/middleware") // Assuming you have this middleware

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login request
router.post(
  "/login",
  regValidate.loginValidationRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management route - requires login to access
router.get(
  "/",
  checkLogin,
  utilities.handleErrors(accountController.accountManagement)
)

// Route to account update view
router.get(
  "/update/:account_id",
  checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// Process account information update
router.post(
  "/update",
  checkLogin,
  regValidate.accountUpdateRules(), // Validation for account update
  regValidate.checkAccountData,    // Check for validation errors
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  checkLogin,
  regValidate.passwordRules(),      // Validation for password update
  regValidate.checkPasswordData,   // Check for validation errors
  utilities.handleErrors(accountController.updatePassword)
)

// Process logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router
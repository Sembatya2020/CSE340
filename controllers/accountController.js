const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  // Placeholder for login validation logic
  const loginResult = await accountModel.validateLogin(account_email, account_password)

  if (loginResult) {
    req.flash("notice", `Welcome back!`)
    res.status(200).render("account/dashboard", {
      title: "Dashboard",
      nav,
    })
  } else {
    req.flash("notice", "Login failed. Please check your credentials.")
    res.status(401).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

module.exports = { 
  buildLogin, 
  buildRegister,
  registerAccount,
  processLogin // Added export for processLogin
}

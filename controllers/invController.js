const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/** Build a single vehicle inventory */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const VehicleMake = data[0].inv_make;
  const VehicleModel = data[0].inv_model;
  const VehicleYear = data[0].inv_year;
  
  res.render("./inventory/vehicle", {
    title: VehicleYear + " " + VehicleMake + " " + VehicleModel,
    nav: nav,
    vehicle: vehicle,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
async function addClassification(req, res) {
  const { classification_name } = req.body
  
  const result = await invModel.addClassification(classification_name)
  
  if (result) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Deliver add inventory view
 * ************************** */
async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classifications,
    errors: null,
  })
}

/* ***************************
 *  Process add inventory
 * ************************** */
async function addInventory(req, res) {
  let nav = await utilities.getNav()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body
  
  const inventoryResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )
  
  if (inventoryResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    let classifications = await utilities.buildClassificationList(classification_id)
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classifications,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
  }
}

module.exports = invCont
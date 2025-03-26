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
invCont.buildVehicle = async function (req, res, next) {
  const inv_id = req.params.vehicleId
  const data = await invModel.getVehicleById(inv_id)
  const vehicle = await utilities.buildVehicle(data)
  let nav = await utilities.getNav()
  const VehicleMake = data[0].inv_make;
  const VehicleModel = data[0].inv_model;
  const VehicleYear = data[0].inv_year;
  
  res.render("./inventory/vehicle", {
    title: VehicleYear + " " + VehicleYear  + " " + VehicleYear ,
    nav,
    vehicle,
  })
}

module.exports = invCont
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = '<ul id="inv-display">';
  if(data.length > 0){
    data.forEach(vehicle => { 
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>`;
    });
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  grid += '</ul>';
  return grid;
};

Util.buildVehicleGrid = async function (data) {
  if (data.length > 0) {
    const vehicle = data[0];
    return `
      <div id="singleVehicleWrapper" class="vehicleImage">
        <picture>
          <source media="(max-width: 400px)" srcset="${vehicle.inv_thumbnail}">
          <source media="(max-width: 600px)" srcset="${vehicle.inv_thumbnail}">
          <source media="(max-width: 1200px)" srcset="${vehicle.inv_image}">
          <source media="(min-width: 1201px)" srcset="${vehicle.inv_image}">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy">
        </picture>
        <ul id="singleVehicleDetails" class="flex-outer">
          <li><h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2></li>
          <li><strong>Price: </strong>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>
          <li><strong>Description: </strong>${vehicle.inv_description}</li>
          <li><strong>Miles: </strong>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</li>
        </ul>
      </div>`;
  } else {
    return `<p class="notice">Sorry, no matching vehicle could be found.</p>`;
  }
};

/* ****************************************
 * Render Error View
 **************************************** */
Util.renderError = function (res, error) {
  res.status(500).render("error", {
    title: "Server Error",
    message: error.message || "An unexpected error occurred.",
  });
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the classification select list
* ************************************* */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util
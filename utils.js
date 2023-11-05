"use strict";

require("dotenv").config();

/** Convert zip code to lat/lng. */
async function convertZip(zip) {
  const resp = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${zip}`);
  const data = (await resp.json()).results[0].locations[0].latLng

  return data.lat.toString() + ',' + data.lng.toString();
}

module.exports = {
  convertZip,
};
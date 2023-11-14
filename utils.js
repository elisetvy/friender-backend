"use strict";

require("dotenv").config();

/** Convert zip code to lat/lng. */
async function convertZip(zip) {
  const resp = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${zip}`);
  const data = await resp.json()

  const coords = data.results[0].locations[0].latLng;

  return coords.lat.toString() + ',' + coords.lng.toString();
}

/** Get distance in miles between 2 ZIP codes. */
async function getDistance(zip1, zip2) {
  const resp = await fetch(`https://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_KEY}&from=${zip1}&to=${zip2}`);
  const data = await resp.json();

  return data.route.distance;
}

/** Check if user is within radius. */
async function checkRadius(zip1, zip2, radius) {
  const resp = await fetch(`https://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_KEY}&from=${zip1}&to=${zip2}`);
  const data = (await resp.json()).route.distance;

  return data <= radius;
}

/** Calculate age based on DOB. */
function calculateAge(dob) {
  const diff_ms = Date.now() - new Date(dob).getTime();
  const age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970)
}

/** Helper for making selective update queries. */
function sqlForPartialUpdate(data) {
  const keys = Object.keys(data);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((col, idx) =>
      `"${col}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(data),
  };
}

module.exports = {
  convertZip,
  getDistance,
  checkRadius,
  calculateAge,
  sqlForPartialUpdate,
};
"use strict";

require("dotenv").config();

/** Convert zip code to lat/lng. */
async function convertZip(zip) {
  const resp = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_KEY}&location=${zip}`);
  const data = (await resp.json()).results[0].locations[0].latLng;

  return data.lat.toString() + ',' + data.lng.toString();
}

/** Get distance in miles between 2 ZIP codes. */
async function getDistance(zip1, zip2) {
  const resp = await fetch(`https://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_KEY}&from=${zip1}&to=${zip2}`);
  return (await resp.json()).route.distance;
}

/** Check if user is within radius. */
async function checkRadius(zip1, zip2, radius) {
  const resp = await fetch(`https://www.mapquestapi.com/directions/v2/route?key=${process.env.MAPQUEST_KEY}&from=${zip1}&to=${zip2}`);
  const data = (await resp.json()).route.distance;

  return data <= radius;
}

module.exports = {
  convertZip,
  getDistance,
  checkRadius,
};
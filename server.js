'use strict'

//load environment variables
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const PORT = process.env.PORT;

app.get('/location', (request, response) => {
  try {
    const locationData = searchToLatLong(request.query.data);
    console.log(locationData);
    response.send(locationData);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Sorry! Something went wrong');
  }
});

app.get('/weather', (request, response) => {
  try {
    const newWeatherData = searchForWeatherAndTime(request.query.data.formatted_query);
    response.send(newWeatherData);
  }
  catch (error) {
    response.status(500).send('Sorry! Something went wrong');
  }
});

app.listen(PORT, () => console.log(`Listen on Port ${PORT}.`));

//Helper Functions
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  console.log(location);
  return location;
}

function searchForWeatherAndTime(query) {
  const weatherSummary = [];
  const weatherData = require('./data/darksky.json');
  weatherData.daily.data.forEach((element) => {
    let weather = new Weather(element);
    weatherSummary.push(weather);
  });
  return weatherSummary;
}

function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

function Weather(data) {
  this.time = new Date(data.time).toString();
  this.forecast = data.summary;
}

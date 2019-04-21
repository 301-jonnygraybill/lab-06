'use strict';

//Load environment variables
require('dotenv').config();

//Load express to do the heavy lifting
const express = require('express');
const app = express();

const cors = require('cors'); //Cross origin resource sharing

app.use(cors()); //tell express to use cors

const PORT = process.env.PORT;

app.get('/testing', (request, response) => {
  console.log('found the testing route')
  response.send('<h1>Henlo Wurl...</h1>')
});

app.get('/location', (request, response) => {
  try {
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went terribly wrong.');
  }
});

app.get('/weather', (request, response) => {
  console.log('From weather Request', request.query.data);
  //call a getWeather fucntion
  //process the data from the darksky json = You need a constructor
  //return the restults to the client
  try {
    const weatherData = searchToForTime(request.query.data);
    response.send(weatherData);
    console.log(weatherData);
   }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went terribly wrong.');
  }

  response.send('Return the results here')
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

//Helper functions

//function to get location data
function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(geoData);
  console.log(location);
  return location;
}

//Constructor for location data
function Location(data) {
  this.formatted_query = data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

//function to get weather data
function searchToForTime(query) {
  const weaData = require('./data/darksky.json');
  //console.log(weaData.daily.data[0]);
  const daWeather = new Weather(weaData.daily.data[0]);
  console.log(daWeather);
  return daWeather;
}

//Start building your weather function and constructor here
function Weather(data) {
  this.forecast = data.summary;
  this.time = data.time;
}


//Loop through array of 8 days' worth of data, and display the time and summary of each day
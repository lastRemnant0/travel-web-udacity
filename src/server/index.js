//require dotenv to be able to access enviroment variables
const dotenv = require('dotenv');
dotenv.config();

//import the required functions for api calls
const { getWeather } = require('./getWeatherApi');
const { getCityImage } = require('./getCityImage');
const { getCountryImage } = require('./getCountryImage');

// Setup empty JS object to act as endpoint for all routes
let planData;
// Require Express to run server and routes
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Start up an instance of app
const PORT = 8081 || process.env.PORT;
const app = express();
console.log(__dirname);
/* Middleware*/
//Here we are configuring express as middle-ware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

//API_KEYS and credentials

//post route to send the fetched data from api to client end point
app.post('/user', async (req, res) => {
  try {
    console.log(process.env.GEONAMES_USERNAME);
    const response = await axios.get(
      `${process.env.GEONAMES_URL}q=dammam&maxRows=1&username=${process.env.GEONAMES_USERNAME}`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      }
    );
    planData = {
      country: response.data.geonames[0].countryName,
      city: response.data.geonames[0].toponymName,
      lat: response.data.geonames[0].lat,
      log: response.data.geonames[0].lng,
    };
  } catch (err) {
    console.log(err);
  }
  try {
    await Promise.all([
      getWeather(planData.lat, planData.log, process.env.WEATHERBIT_API_KEY),
      getCityImage(planData.city, process.env.PIXBAY_API_KEY),
      getCountryImage(planData.country, process.env.PIXBAY_API_KEY),
    ]).then(function (results) {
      const weather = results[0];
      const imageCity = results[1];
      const imageCountry = results[2];
      if (imageCity.data.totalHits === 0) {
        planData = {
          ...planData,
          countryImage: imageCountry.data.hits[0].largeImageURL,
        };
      } else {
        planData = {
          ...planData,
          cityImage: imageCity.data.hits[0].largeImageURL,
        };
      }
      planData = {
        ...planData,
        temp: weather.data.data[0].temp,
        max_temp: weather.data.data[0].max_temp,
        low_temp: weather.data.data[0].low_temp,
      };
      res.status(200).send(planData);
      console.log(planData);
    });
  } catch (err) {
    console.log(err);
  }
  // try {
  //   // fetching the required data from geonames and store it in planData
  //   await axios({
  //     method: 'get',
  //     url: 'http://api.geonames.org/searchJSON?q=dammam&maxRows=1&username=KEY',
  //     responseType: 'json',
  //   })
  //     .then((response) => {
  //       planData = {
  //         country: response.data.geonames[0].countryName,
  //         city: response.data.geonames[0].toponymName,
  //         lat: response.data.geonames[0].lat,
  //         log: response.data.geonames[0].lng,
  //       };
  //     })
  //     .catch((err) => console.log(err));
  //   await axios({
  //     method: 'get',
  //     url: `https://api.weatherbit.io/v2.0/forecast/daily?lat=${planData.lat}&lon=${planData.log}&key=KEY`,
  //     responseType: 'json',
  //   })
  //     .then((response) => {
  //       // planData.max_temp = response.data.data[0].max_temp;
  //       // planData.low_temp = response.data.data[0].low_temp;
  //       planData = {
  //         ...planData,
  //         max_temp: response.data.data[0].max_temp,
  //         low_temp: response.data.data[0].low_temp,
  //       };
  //       console.log(planData);
  //     })
  //     .catch((err) => console.log(err));
  //   res.status(201).send(planData);
  // } catch (err) {
  //   console.log(err);
  // }
});
// Setup Server
app.listen(8081, () => {
  console.log(`listening on port: ${PORT}`);
});

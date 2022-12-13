// Setup empty JS object to act as endpoint for all routes
let planData;
// Require Express to run server and routes
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Start up an instance of app
const PORT = 8081;
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

//post route to send the fetched data from api to client end point
app.post('/user', async (req, res) => {
  function getWeather(lat, log) {
    return axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${log}&key=KEY`
    );
  }
  function getCityImage(city) {
    return axios.get(
      `https://pixabay.com/api/?key=KEY=${city}&image_type=photo&pretty=true&category=buildings`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      }
    );
  }
  try {
    const response = await axios.get(
      'http://api.geonames.org/searchJSON?q=dammam&maxRows=1&username=KEY',
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
    res.send(planData);
  } catch (err) {
    console.log(err);
  }
  try {
    await Promise.all([
      getWeather(planData.lat, planData.log),
      getCityImage(planData.country),
    ]).then(function (results) {
      const weather = results[0];
      const image = results[1];
      console.log(`temp: ${weather.data.data[0].max_temp}
      imageURL: ${image.data.hits[0].largeImageURL}`);
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

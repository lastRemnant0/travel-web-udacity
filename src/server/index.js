//require dotenv to be able to access enviroment variables
const dotenv = require("dotenv");
dotenv.config();

// Require Express to run server and routes
const path = require("path");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
// setting fetch to be able to use fetch from server
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
//import the required functions for api calls
const { getWeather } = require("./getWeatherApi");
const { getCityImage } = require("./getCityImage");
const { getCountryImage } = require("./getCountryImage");

// Setup empty JS object to act as endpoint for all routes
let planData;

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
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

//API_KEYS and credentials

//post route to send the fetched data from api to client end point
app.post("/userPlan", async (req, res) => {
  try {
    const city = req.body.dest;
    //replacing spaces with + before passing it
    const cleanedCity = city.replace(/\s/g, "+");
    console.log("user dest: " + cleanedCity);
    const response = await axios.get(
      `${process.env.GEONAMES_URL}q=${cleanedCity}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`,
      {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      }
    );
    planData = {
      country: response.data.geonames[0].countryName,
      city: response.data.geonames[0].toponymName,
      lat: response.data.geonames[0].lat,
      log: response.data.geonames[0].lng,
      depart_date: req.body.depart_date,
    };
  } catch (err) {
    console.log(err);
  }

  try {
    await getWeather(planData.lat, planData.log, process.env.WEATHERBIT_API_KEY)
      .then((response) => {
        const weather = [...response.data.data];
        planData = {
          ...planData,
          max_temp: response.data.data[0].max_temp,
          temp: response.data.data[0].temp,
          low_temp: response.data.data[0].low_temp,
          daily_weather: weather,
        };
        console.log("FETCHED DATA FROM WEATHERBIT SUCCESSFULLY");
        // res.status(200).send(planData);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }

  try {
    await getCityImage(
      planData.city.replace(/\s/g, "+"),
      process.env.PIXBAY_API_KEY
    ).then(async (response) => {
      if (response.data.totalHits === 0) {
        try {
          await getCountryImage(
            planData.country.replace(/\s/g, "+"),
            process.env.PIXBAY_API_KEY
          ).then((response) => {
            const country_city = response.data.hits[0].webformatURL;
            planData = {
              ...planData,
              countryImage: country_city,
            };
            console.log("COUNTRY IMAGE FETCHED ");
            res.status(200).send(planData);
          });
        } catch (err) {
          console.log(`PIXABAY COUNTRY ERROR: ${err}`);
        }
      } else {
        planData = {
          ...planData,
          cityImage: response.data.hits[0].webformatURL,
        };
        console.log("CITY IMAGE FETCHED");
        res.status(200).send(planData);
      }
    });
    //
  } catch (err) {
    console.log("PIXABAY API ERROR: " + err);
  }

  // res.status(201).send(planData);
});

// app.get("/pixa", async (req, res) => {
//   const URL = `${process.env.PIXBAY_URL}key=${
//     process.env.PIXBAY_API_KEY
//   }&q=${planData.city.replace(
//     /\s/g,
//     "+"
//   )}&image_type=photo&pretty=true&category=buildings`;
//   const response = await fetch(URL);

//   try {
//     const pixaData = await response.json();
//     planData = {
//       ...planData,
//       cityImage: pixaData.data.hits[0].webformatURL,
//     };
//     res.send(planData);
//   } catch (err) {
//     console.log("FETCH PIXA: " + err);
//   }
// });

// app.get("/pixa", async (req, res) => {
//   try {
//     await getCityImage(planData.city, process.env.PIXBAY_API_KEY).then(
//       async (response) => {
//         if (response.data.totalHits === 0) {
//           try {
//             await getCountryImage(
//               planData.country,
//               process.env.PIXBAY_API_KEY
//             ).then((response) => {
//               const country_city = response.data.hits[0].webformatURL;
//               planData = {
//                 ...planData,
//                 countryImage: country_city,
//               };
//               console.log("COUNTRY IMAGE FETCHED ");
//               res.status(200).send(planData);
//             });
//           } catch (err) {
//             console.log(`PIXABAY COUNTRY ERROR: ${err}`);
//           }
//         } else {
//           planData = {
//             ...planData,
//             cityImage: response.data.hits[0].webformatURL,
//           };
//           console.log("CITY IMAGE FETCHED");
//           res.status(200).send(planData);
//         }
//       }
//     );
//     //
//   } catch (err) {
//     console.log("PIXABAY API ERROR: " + err);
//   }
// });
// Setup Server
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

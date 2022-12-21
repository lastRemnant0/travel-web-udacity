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
// const { getWeather } = require("./getWeatherApi");
// const { getCityImage } = require("./getCityImage");
// const { getCountryImage } = require("./getCountryImage");

// Setup empty JS object to act as endpoint for all routes
let planData;

// Start up an instance of app
const PORT = 3000 || process.env.PORT;
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
  const city = req.body.dest;
  //replacing spaces with + before passing it
  const cleanedCity = city.replace(/\s/g, "+");
  console.log("user dest: " + cleanedCity);
  // call geonames api to get data from it
  await fetch(
    `${process.env.GEONAMES_URL}q=${cleanedCity}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`
  )
    .then(async (response) => await response.json())
    .then((data) => {
      planData = {
        country: data.geonames[0].countryName,
        city: data.geonames[0].toponymName,
        lat: data.geonames[0].lat,
        log: data.geonames[0].lng,
        depart_date: req.body.depart_date,
        days_to: req.body.days_to,
      };
      console.log("FETCHED DATA FROM GEONAMES SUCCESSFULLY");

      // call weatherbit api to get data from it
      fetch(
        `${process.env.WEATHER_URL}lat=${planData.lat}&lon=${planData.log}&key=${process.env.WEATHERBIT_API_KEY}`
      )
        .then(async (response) => await response.json())
        .then(async (data) => {
          const weather = [...data.data];
          planData = {
            ...planData,
            max_temp: data.data[0].max_temp,
            temp: data.data[0].temp,
            low_temp: data.data[0].low_temp,
            icon: data.data[0].weather.icon,
            temp_desc: data.data[0].weather.description,
            daily_weather: weather,
          };
          console.log("FETCHED DATA FROM WEATHERBIT SUCCESSFULLY");

          // call pixabay api to get data from it and send it to the client
          try {
            await fetch(
              `https://pixabay.com/api/?key=${process.env.PIXBAY_API_KEY}&q=${planData.city}&image_type=photo&pretty=true&category=places`
            )
              .then(async (response) => await response.json())
              .then((data) => {
                // if no city found then we look for its country image
                if (data.totalHits === 0) {
                  fetch(
                    `https://pixabay.com/api/?key=${process.env.PIXBAY_API_KEY}&q=${planData.country}&image_type=photo&pretty=true&category=places`
                  )
                    .then(async (response) => await response.json())
                    .then((data) => {
                      planData = {
                        ...planData,
                        countryImage: data.hits[0].webformatURL,
                      };
                      console.log("COUNTRY IMAGE FETCHED ");
                      res.send(planData);
                    })
                    .catch((err) => console.log("pixa country" + err.message));
                } else {
                  planData = {
                    ...planData,
                    cityImage: data.hits[0].webformatURL,
                  };
                  console.log("CITY IMAGE FETCHED ");
                  res.send(planData);
                }
              })
              .catch((error) => {
                console.log("PIXA ERROR: " + error.message);
              });
          } catch (err) {
            console.log("ERROR: " + err.message);
          }
        })
        .catch((err) => console.log("WEATHERBIT ERROR: " + err.message));
    })
    .catch((error) => {
      console.log("GEONAMES ERRO: " + error.message);
    });
  // -------------------------------------------------------------- //
  // await axios
  //   .get(
  //     `${process.env.GEONAMES_URL}q=${cleanedCity}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`,
  //     {
  //       headers: { "Accept-Encoding": "gzip,deflate,compress" },
  //     }
  //   )
  //   .then((response) => {
  //     planData = {
  //       country: response.data.geonames[0].countryName,
  //       city: response.data.geonames[0].toponymName,
  //       lat: response.data.geonames[0].lat,
  //       log: response.data.geonames[0].lng,
  //       depart_date: req.body.depart_date,
  //     };
  //     getWeather(planData.lat, planData.log, process.env.WEATHERBIT_API_KEY)
  //       .then((response) => {
  //         const weather = [...response.data.data];
  //         planData = {
  //           ...planData,
  //           max_temp: response.data.data[0].max_temp,
  //           temp: response.data.data[0].temp,
  //           low_temp: response.data.data[0].low_temp,
  //           daily_weather: weather,
  //         };
  //         console.log("FETCHED DATA FROM WEATHERBIT SUCCESSFULLY");
  //         getCityImage(
  //           planData.city.replace(/\s/g, "+"),
  //           process.env.PIXBAY_API_KEY
  //         )
  //           .then((response) => {
  //             if (response.data.totalHits === 0) {
  //               getCountryImage(
  //                 planData.country.replace(/\s/g, "+"),
  //                 process.env.PIXBAY_API_KEY
  //               )
  //                 .then((response) => {
  //                   const country_city = response.data.hits[0].webformatURL;
  //                   planData = {
  //                     ...planData,
  //                     countryImage: country_city,
  //                   };
  //                   console.log("COUNTRY IMAGE FETCHED ");
  //                   res.status(200).send(planData);
  //                 })
  //                 .catch((err) => console.log("pixa country" + err));
  //             } else {
  //               planData = {
  //                 ...planData,
  //                 cityImage: response.data.hits[0].webformatURL,
  //               };
  //               console.log("CITY IMAGE FETCHED");
  //               res.status(200).send(planData);
  //             }
  //           })
  //           .catch((err) => console.log("pixa " + err));
  //         // res.status(200).send(planData);
  //       })
  //       .catch((err) => console.log("weahter " + err));
  //   })
  //   .catch((err) => console.log("geoname  " + err));

  // getCityImage(planData.city.replace(/\s/g, "+"), process.env.PIXBAY_API_KEY)
  //   .then((response) => {
  //     if (response.data.totalHits === 0) {
  //       getCountryImage(
  //         planData.country.replace(/\s/g, "+"),
  //         process.env.PIXBAY_API_KEY
  //       )
  //         .then((response) => {
  //           const country_city = response.data.hits[0].webformatURL;
  //           planData = {
  //             ...planData,
  //             countryImage: country_city,
  //           };
  //           console.log("COUNTRY IMAGE FETCHED ");
  //           res.status(200).send(planData);
  //         })
  //         .catch((err) => console.log("pixa country" + err));
  //     } else {
  //       planData = {
  //         ...planData,
  //         cityImage: response.data.hits[0].webformatURL,
  //       };
  //       console.log("CITY IMAGE FETCHED");
  //       res.status(200).send(planData);
  //     }
  //   })
  //   .catch((err) => console.log("pixa " + err));
  //

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

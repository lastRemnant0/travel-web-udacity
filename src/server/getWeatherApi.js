const axios = require("axios");
async function getWeather(lat, log, WEATHERBIT_API_KEY) {
  return await axios.get(
    `${process.env.WEATHER_URL}lat=${lat}&lon=${log}&key=${WEATHERBIT_API_KEY}`,
    {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    }
  );
}

module.exports.getWeather = getWeather;

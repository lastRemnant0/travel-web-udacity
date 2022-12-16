const axios = require("axios");
async function getCityImage(city, PIXBAY_API_KEY) {
  return await axios.get(
    `${process.env.PIXBAY_URL}key=${PIXBAY_API_KEY}&q=${city}&image_type=photo&pretty=true&category=buildings`,
    {
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    }
  );
}

module.exports.getCityImage = getCityImage;

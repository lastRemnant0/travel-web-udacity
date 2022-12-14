const axios = require('axios');
async function getCountryImage(country, PIXBAY_API_KEY) {
  return await axios.get(
    `${process.env.PIXBAY_URL}key=${PIXBAY_API_KEY}&q=${country}&image_type=photo&pretty=true&category=buildings`,
    {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    }
  );
}

module.exports.getCountryImage = getCountryImage;

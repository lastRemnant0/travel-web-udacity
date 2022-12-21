function savedTripsUI(data) {
  // create all the elements then populate them with the data
  let trips = data;

  const fragment = document.createDocumentFragment();
  const cardsContainerEl = document.querySelector(".cards-container");
  for (let j = 0; j < trips.length; j++) {
    const cardEl = document.createElement("article");
    const cardBackgroundEl = document.createElement("img");
    const deleteBtn = document.createElement("button");
    const tripInfoEl = document.createElement("div");
    const tripWeatherEl = document.createElement("div");
    const currentWeatherEl = document.createElement("div");
    const forecastWeather = document.createElement("div");
    //setting up attributes for created elements
    cardEl.setAttribute("class", "card");
    cardEl.setAttribute("data-id", trips[j].id);
    cardBackgroundEl.setAttribute("class", "trip-background");
    // if there's no image for city use the country instead
    if (trips[j].countryImage) {
      cardBackgroundEl.setAttribute("src", trips[j].countryImage);
      console.log("COUNTRY LOADED");
    } else {
      cardBackgroundEl.setAttribute("src", trips[j].cityImage);
      console.log("CITY LOADED");
    }
    deleteBtn.setAttribute("class", "delete");
    deleteBtn.setAttribute("id", trips[j].id);
    tripInfoEl.setAttribute("class", "trip-info");
    tripWeatherEl.setAttribute("class", "trip-weather");
    currentWeatherEl.setAttribute("class", "current-weather");
    forecastWeather.setAttribute("class", "forecast-weather");

    //for loop to create 3 elements for daily forecast
    for (let i = 1; i < trips[j].daily_weather.length; i++) {
      const daysWeather = document.createElement("div");
      const date = `${
        new Date(trips[j].daily_weather[i].datetime).getMonth() + 1
      }/${new Date(trips[j].daily_weather[i].datetime).getDate()}`;
      daysWeather.setAttribute("class", "days-weather");
      daysWeather.innerHTML = `<h4>${date}</h4>
    <p>${Math.round(trips[j].daily_weather[i].temp)}<span>&#8451</span></p>`;
      forecastWeather.insertAdjacentElement("beforeend", daysWeather);
    }
    // populte elements with data
    deleteBtn.innerHTML = "&#10005";
    tripInfoEl.innerHTML = `<h2 class="trip-hero">${trips[j].city}, ${trips[j].country}</h2>
  <p class="trip-to-days">${trips[j].depart_date}, ${trips[j].days_to} days away</p>`;
    currentWeatherEl.innerHTML = `<h4><img src="https://www.weatherbit.io/static/img/icons/${trips[j].icon}.png"/></h4>
  <p>${trips[j].temp}<span>&#8451</span></p>
  <h4><img src="https://www.weatherbit.io/static/img/icons/${trips[j].icon}.png"/></h4>`;
    //append all elements to show up on the screen
    cardEl.appendChild(cardBackgroundEl);
    cardEl.appendChild(deleteBtn);
    cardEl.appendChild(tripInfoEl);
    tripWeatherEl.appendChild(currentWeatherEl);
    tripWeatherEl.appendChild(forecastWeather);
    cardEl.appendChild(tripWeatherEl);
    fragment.appendChild(cardEl);

    cardEl.style.display = "flex";
  }
  cardsContainerEl.appendChild(fragment);
}

export { savedTripsUI };

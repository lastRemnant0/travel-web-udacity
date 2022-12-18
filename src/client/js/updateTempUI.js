function updateTempUI(data) {
  const tripTempCity = document.querySelector(".trip-hero-temp");
  const tripTempRemain = document.querySelector(".trip-to-days-temp");
  const tripTodayTempra = document.querySelector(".today-temp");
  const tripTodayDesc = document.querySelector(".today-desc");

  tripTempCity.innerText = `${data.city}, ${data.country}`;
  tripTempRemain.innerText = `${data.depart_date} - ${data.days_to} Days away`;
  tripTodayTempra.innerHTML = `<h5><img src="https://www.weatherbit.io/static/img/icons/${
    data.icon
  }.png"/></h5><h4>${roundTemp(
    data.temp
  )}</h4><h5><img src="https://www.weatherbit.io/static/img/icons/${
    data.icon
  }.png"/>`;
  tripTodayDesc.innerHTML = `<h5><span>Low:</span> ${roundTemp(
    data.low_temp
  )}</h5>
  <p>${data.temp_desc}</p>
  <h5><span>High:</span> ${data.low_temp(data.max_temp)}</h5>`;
}

function roundTemp(temp) {
  return Math.round(temp);
}
export { updateTempUI };

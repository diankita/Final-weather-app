// =============== common functions ===============
function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = `${day} ${hours}:${minutes}`;
}

formatDate(new Date());

function formatCityName(city, country) {
  return `${city}, ${country}`;
}
function showInformation(city, response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  if (response.data.weather[0].description.includes("rain")) {
    document.querySelector(
      "#tip"
    ).innerHTML = `Don't forget to take an umbrella 🌂`;
  } else if (Math.round(response.data.main.temp) < 15) {
    document.querySelector(
      "#tip"
    ).innerHTML = `Don't forget to take a jacket 🧥`;
  } else {
    document.querySelector("#tip").innerHTML = `Enjoy your day 🙂`;
  }

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let iconSrc = response.data.weather[0].icon;
  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute("src", `images/${iconSrc}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  searchCity(cityInputElement);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// =============== search by current position ===============

function getTemperatureBasedOnCurrentPosition(position) {
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let units = "metric";
  let apiUrlPosition = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlPosition).then(function (response) {
    let cityName = formatCityName(
      response.data.name,
      response.data.sys.country
    );
    showInformation(cityName, response);
  });
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(
    getTemperatureBasedOnCurrentPosition
  );
}

// =============== search by city ===============

function getTemperatureBasedOnCityCoordinates(response) {
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let units = "metric";
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  const cityName = formatCityName(
    response.data[0].name,
    response.data[0].country
  );
  axios.get(apiUrlTemp).then(function (response) {
    showInformation(cityName, response);
  });
}

function searchCity(city) {
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  axios.get(apiUrlCoords).then(getTemperatureBasedOnCityCoordinates);
}

// initialise app
searchCity("Cancun");
let currentPositionBtn = document.querySelector("#current-position-btn");
currentPositionBtn.addEventListener("click", getCurrentPosition);

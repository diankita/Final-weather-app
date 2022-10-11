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

function getTemperatureBasedOnCoordinates(position) {
  console.log(position.data);
  let lat = position.data[0].lat;
  let lon = position.data[0].lon;
  let units = "metric";
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = `${position.data[0].name}, ${position.data[0].country}`;
  axios.get(apiUrlTemp).then(showCurrentInformation);
}

function showCurrentInformation(response) {
  let temperatureElement = document.querySelector("#degrees");
  celsiusTemp = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemp);

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
  celsiusFeelsLikeTemp = response.data.main.feels_like
  feelsLikeElement.innerHTML = `${Math.round(celsiusFeelsLikeTemp)}°C`;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let iconSrc = response.data.weather[0].icon;
  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute("src", `images/${iconSrc}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function searchCity(city) {
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  axios.get(apiUrlCoords).then(getTemperatureBasedOnCoordinates);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  searchCity(cityInputElement);
}

function searchPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlTemp).then(function (response) {
    document.querySelector(
      "#city"
    ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    showCurrentInformation(response);
  });
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

function showFahrenheitTemp(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  let fahrenheitFeelsLikeTemp = (celsiusFeelsLikeTemp * 9) / 5 + 32;
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `${Math.round(fahrenheitFeelsLikeTemp)}°F`;
}

function showCelsiusTemp(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `${Math.round(celsiusFeelsLikeTemp)}°C`;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentPositionBtn = document.querySelector("#current-position-btn");
currentPositionBtn.addEventListener("click", getCurrentPosition);

let celsiusTemp = null;
let celsiusFeelsLikeTemp = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

searchCity("Cancun");

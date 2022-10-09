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
  console.log(position.data)
  let lat = position.data[0].lat;
  let lon = position.data[0].lon;
  let units = "metric";
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = `${position.data[0].name}, ${position.data[0].country}`;
  axios.get(apiUrlTemp).then(showTemperature);
}

function showTemperature(response) {
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

function searchCity(city) {
  let apiKey = "281450ec88936f4fa8ee9864682b49a0";
  let apiUrlCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  axios.get(apiUrlCoords).then(getTemperatureBasedOnCoordinates);
}

searchCity("Cancun");

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  searchCity(cityInputElement)
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(getTemperatureBasedOnCoordinates)
}

let currentPositionBtn = document.querySelector("#current-position-btn");
currentPositionBtn.addEventListener("click", getCurrentPosition);
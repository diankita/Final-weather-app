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

// ===== search city =====
function searchCity(city) {
  let apiUrlCoords = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  axios.get(apiUrlCoords).then(getTemperatureBasedOnCoordinates);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input").value;
  city = cityInputElement;
  searchCity(cityInputElement);
}

// ===== search current position =====
function searchPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
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

// ===== show current info =====
function getTemperatureBasedOnCoordinates(position) {
  console.log("getTemperatureBasedOnCoordinates", position.data[0]);
  let lat = position.data[0].lat;
  let lon = position.data[0].lon;
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = `${position.data[0].name}, ${position.data[0].country}`;
  axios.get(apiUrlTemp).then(showCurrentInformation);
}

function showCurrentInformation(response) {
  console.log("showCurrentInformation", response.data);
  let temperatureElement = document.querySelector("#degrees");
  celsiusTemp = response.data.current.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.current.weather[0].description;

  if (response.data.current.weather[0].description.includes("rain") || response.data.current.weather[0].description.includes("thunderstorm")) {
    document.querySelector("#tip").innerHTML = `Don't forget your umbrella 🌂`;
  } else if (Math.round(response.data.current.temp) < 15) {
    document.querySelector("#tip").innerHTML = `Don't forget your jacket 🧥`;
  } else {
    document.querySelector("#tip").innerHTML = `Enjoy your day 🙂`;
  }

  let feelsLikeElement = document.querySelector("#feels-like");
  celsiusFeelsLikeTemp = response.data.current.feels_like;
  feelsLikeElement.innerHTML = Math.round(celsiusFeelsLikeTemp);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.current.wind_speed);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.current.humidity;

  let iconSrc = response.data.current.weather[0].icon;
  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute("src", `images/${iconSrc}.png`);
  iconElement.setAttribute("alt", response.data.current.weather[0].description);
}

// ===== show forecast info =====
function showForecast(response) {
  console.log("showForecast", response.data);
}

function showForecastInformation() {
  let forecastElement = document.querySelector("#weather-forecast-section");

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let forecastHTML = `<div class="row">`;
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col-4 forecast-information">
                <img src="images/01d.png" alt="" width="30px" />
                <div class="forecast-temp">
                  <span class="forecast-temp-max">17° </span
                  ><span class="forecast-temp-min">10°</span>
                </div>
                <div class="forecast-day">${day}</div>
              </div>`;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

// ====== unit conversion =======
function showFahrenheitTemp(event) {
  event.preventDefault();

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  let fahrenheitFeelsLikeTemp = (celsiusFeelsLikeTemp * 9) / 5 + 32;
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(fahrenheitFeelsLikeTemp);
}

function showCelsiusTemp(event) {
  event.preventDefault();

  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(celsiusFeelsLikeTemp);
}

let celsiusTemp = null;
let celsiusFeelsLikeTemp = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentPositionBtn = document.querySelector("#current-position-btn");
currentPositionBtn.addEventListener("click", getCurrentPosition);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

let apiKey = "281450ec88936f4fa8ee9864682b49a0";

let city = "Cancun";
let units = "metric";

searchCity(city);
showForecastInformation();

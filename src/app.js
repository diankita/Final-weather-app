// ====== format date and time ======
function formatCurrentDateAndTime(date) {
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

formatCurrentDateAndTime(new Date());

function formatForecastDayBasedOnApiResponse(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let forecastWeekday = forecastDate.getDay();

  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  return weekdays[forecastWeekday];
}

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
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlTemp).then(function (response) {
    document.querySelector(
      "#city"
    ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
    showUpdatedWeatherDetails(response);
  });
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

// ===== show weather info =====
function getTemperatureBasedOnCoordinates(position) {
  let lat = position.data[0].lat;
  let lon = position.data[0].lon;
  let apiUrlTemp = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=${units}`;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = `${position.data[0].name}, ${position.data[0].country}`;
  axios.get(apiUrlTemp).then(showUpdatedWeatherDetails);
}

function showUpdatedWeatherDetails(response) {
  let apiResponseCurrentWeather = response.data.current;

  let temperatureElement = document.querySelector("#degrees");
  celsiusTemp = apiResponseCurrentWeather.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = apiResponseCurrentWeather.weather[0].description;

  if (apiResponseCurrentWeather.weather[0].description.includes("rain") || apiResponseCurrentWeather.weather[0].description.includes("thunderstorm")) {
    document.querySelector("#tip").innerHTML = `Don't forget your umbrella 🌂`;
  } else if (Math.round(apiResponseCurrentWeather.temp) < 15) {
    document.querySelector("#tip").innerHTML = `Don't forget your jacket 🧥`;
  } else {
    document.querySelector("#tip").innerHTML = `Enjoy your day 🙂`;
  }

  let feelsLikeElement = document.querySelector("#feels-like");
  celsiusFeelsLikeTemp = apiResponseCurrentWeather.feels_like;
  feelsLikeElement.innerHTML = Math.round(celsiusFeelsLikeTemp);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(apiResponseCurrentWeather.wind_speed);

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = apiResponseCurrentWeather.humidity;

  let iconSrc = apiResponseCurrentWeather.weather[0].icon;
  let iconElement = document.querySelector("#main-icon");
  iconElement.setAttribute("src", `images/${iconSrc}.png`);
  iconElement.setAttribute("alt", apiResponseCurrentWeather.weather[0].description);

  let apiResponseForecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast-section");

  let forecastHTML = `<div class="row">`;
  apiResponseForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
    forecastHTML =
      forecastHTML +
      `<div class="col-4 forecast-information">
                <div class="forecast-day">${formatForecastDayBasedOnApiResponse(
                  forecastDay.dt
                )}</div>
                <img src="images/${
                  forecastDay.weather[0].icon
                }.png" alt="" width="30px" />
                <div class="forecast-temp">
                  <span class="forecast-temp-max">${Math.round(
                    forecastDay.temp.max
                  )}° </span
                  ><span class="forecast-temp-min">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
                
                <div class="forecast-description">${forecastDay.weather[0].description}</div>
              </div>`;
  }
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
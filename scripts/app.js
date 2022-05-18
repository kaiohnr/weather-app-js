const searchCountry = document.querySelector('.search-country input');
const searchBtn = document.querySelector('.search-country button');
const temperature = document.querySelector('#temp');
const tempIcon = document.querySelector('#temp-icon');
const cityName = document.querySelector('#city-name');
const errorContainer = document.querySelector('.error__container');
const errorMessage = document.querySelector('.error-message');
const countryInitials = document.querySelector('#country-initials');
const tempDescription = document.querySelector('#description');
const maxTemp = document.querySelector('.max-temp');
const minTemp = document.querySelector('.min-temp');
const errorImage = document.querySelector('.error-image');
const apiKey = '9ddbee56a124616a52f9def78b62bd51';

const tryUserLocation = async function (position) {
  try {
    const { latitude: lat, longitude: lon } = position.coords;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await response.json();
    updateWeather(data);
  } catch (error) {
    console.log('Something went wrong. Try again!');
  }
};

const getWeather = async function () {
  const country = searchCountry.value;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=9ddbee56a124616a52f9def78b62bd51`
    );
    if (!response) throw new Error();
    const data = await response.json();
    updateWeather(data);
    weatherSuccess();
  } catch (error) {
    errorMessage.textContent = `can't get data`;
    weatherError();
  }
};

searchBtn.addEventListener('click', getWeather);

let opacity = 0;
let interval = 0;

// Convert temperature value to Celsius
const convertTempValue = function (value) {
  const convertededValue = value - 273.15;
  return Math.floor(convertededValue) + 'ºC';
};

// Capitalize temperature description
const capitalizeDescription = function (description) {
  const words = description.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }

  return words.join(' ');
};

// Show weather error
const weatherError = function () {
  fadeOut();
  errorImage.style.opacity = 0.8;
  tempIcon.style.opacity = 0;
  temperature.style.opacity = 0;
  tempIcon.style.opacity = 0;
  cityName.style.opacity = 0;
  countryInitials.style.opacity = 0;
  tempDescription.style.opacity = 0;
  maxTemp.style.opacity = 0;
  minTemp.style.opacity = 0;
};

// Show weather details
const weatherSuccess = function () {
  errorImage.style.opacity = 0;
  tempIcon.style.opacity = 1;
  temperature.style.opacity = 1;
  tempIcon.style.opacity = 1;
  cityName.style.opacity = 1;
  countryInitials.style.opacity = 1;
  tempDescription.style.opacity = 1;
  maxTemp.style.opacity = 1;
  minTemp.style.opacity = 1;
};

// Fade error message
const fadeOut = function () {
  errorContainer.style.opacity = 0.8;
  interval = setInterval(hideMessage, 5000);
};

// Hide error message
const hideMessage = function () {
  opacity = +window
    .getComputedStyle(errorContainer)
    .getPropertyValue('opacity');
  if (opacity > 0) {
    opacity = opacity - 0.8;
    errorContainer.style.opacity = opacity;
  } else {
    clearInterval(fadeOut);
  }
};

const updateWeather = function (data) {
  temperature.textContent = convertTempValue(data.main.temp);
  tempIcon.src =
    'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
  cityName.textContent = data.name;
  countryInitials.textContent = data.sys.country;
  tempDescription.textContent = capitalizeDescription(
    data.weather[0].description
  );
  maxTemp.textContent = convertTempValue(data.main.temp_max);
  minTemp.textContent = convertTempValue(data.main.temp_min);
};

navigator.geolocation.getCurrentPosition(tryUserLocation, weatherError);

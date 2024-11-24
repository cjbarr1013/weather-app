import { UserInterface } from './UserInterface.js';
import { WeatherAPI } from './WeatherAPI.js';

export function App() {
  let weatherData;
  let start = true;

  const container = document.querySelector('.main-grid-container');
  const myDialog = document.querySelector('dialog');
  const locInput = document.querySelector('input');
  const submitBtn = document.querySelector('#submit-btn');
  const changeLocBtn = document.querySelector('#change-loc-btn');
  const allowLocBtn = document.querySelector('#allow-loc-btn');

  const userInterface = UserInterface(container);

  window.addEventListener('load', () => {
    userInterface.showDialog(myDialog);
    updateWeatherData('new york city');
  });

  submitBtn.addEventListener('click', (e) => {
    updateWeatherData(locInput.value);
    e.preventDefault();
  });

  changeLocBtn.addEventListener('click', () => {
    userInterface.hideInputError();
    userInterface.showDialog(myDialog);
  });

  allowLocBtn.addEventListener('click', () => {
    getUserLocation();
  });

  const updateWeatherData = async (loc) => {
    const weather = WeatherAPI(loc);
    weatherData = await weather.getData();
    console.log(weatherData);

    if (Object.keys(weatherData.us).length !== 0 && start === false) {
      userInterface.updateAll(weatherData.us, 'us');
      userInterface.hideDialog(myDialog);
    } else if (Object.keys(weatherData.us).length !== 0) {
      userInterface.updateAll(weatherData.us, 'us');
      start = false;
    } else {
      handleInputError();
    }
  };

  const getUserLocation = () => {
    function success(position) {
      userInterface.hideDialog(myDialog);
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      updateWeatherData(lat + ',' + long);
    }

    function error() {
      alert(
        'Unable to retrieve your location. Please check that loaction services are enabled.'
      );
      userInterface.showDialog(myDialog);
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const handleInputError = () => {
    userInterface.showInputError();
  };
}

// Add validation on submit click
// Add F to C switch
// Hide APIs

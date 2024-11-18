// import { UserInterface } from './UserInterface.js';
import { WeatherAPI } from './WeatherAPI.js';

const search = document.querySelector('input');
const myButton = document.querySelector('button');
myButton.addEventListener('click', async () => {
  const weather = WeatherAPI(search.value);
  const data = await weather.getData();
  console.log(data);
});

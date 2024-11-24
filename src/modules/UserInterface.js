import { MapsAPI } from './MapsAPI.js';
import { converter } from './Converter.js';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';

export function UserInterface(container) {
  const map = MapsAPI();
  let speedUnit, distUnit, tempUnit, zone;

  const currentTopContainer = container.querySelector('.current-top');
  const currentBottomContainer = container.querySelector('.current-bottom');
  const hourlyDiv = container.querySelector('.hourly');
  const dailyDiv = container.querySelector('.daily');
  const mapContainer = container.querySelector('.right-side');
  const errorContainer = document.querySelector('.error-container');

  const changeUnits = (type) => {
    if (type === 'us') {
      speedUnit = 'mph';
      distUnit = 'mi';
      tempUnit = '°F';
    } else {
      speedUnit = 'km/h';
      distUnit = 'km';
      tempUnit = '°C';
    }
  };

  const updateCurrentTop = (current, loc, today) => {
    const conditionsIcon =
      currentTopContainer.querySelector('.conditions-icon');
    conditionsIcon.classList = '';
    conditionsIcon.classList.add('conditions-icon', current.icon + '-animated');

    const location = currentTopContainer.querySelector('.location');
    location.textContent = loc;

    const conditionsDesc =
      currentTopContainer.querySelector('.conditions-desc');
    conditionsDesc.textContent = current.conditions;

    const currentTemp = currentTopContainer.querySelector('.current-temp');
    currentTemp.textContent = Math.round(current.temp) + tempUnit;

    const highTemp = currentTopContainer.querySelector('.high-temp > span');
    highTemp.textContent = Math.round(today.highTemp) + tempUnit;

    const lowTemp = currentTopContainer.querySelector('.low-temp > span');
    lowTemp.textContent = Math.round(today.lowTemp) + tempUnit;
  };

  const updateCurrentBottom = (current) => {
    const wind = currentBottomContainer.querySelector(
      '.wind > p:nth-of-type(2)'
    );
    const windDirection = converter.degreesToCardinal(current.windDirection);
    wind.textContent = `${Math.round(current.windSpeed)} ${speedUnit} ${windDirection}`;

    const uv = currentBottomContainer.querySelector('.uv > p:nth-of-type(2)');
    uv.textContent = current.uv;

    const visibility = currentBottomContainer.querySelector(
      '.visibility > p:nth-of-type(2)'
    );
    visibility.textContent = current.visibility + ' ' + distUnit;

    const dew = currentBottomContainer.querySelector('.dew > p:nth-of-type(2)');
    dew.textContent = Math.round(current.dew) + tempUnit;

    const humidity = currentBottomContainer.querySelector(
      '.humidity > p:nth-of-type(2)'
    );
    humidity.textContent = current.humidity + '%';

    const moon = currentBottomContainer.querySelector('.moon > div');
    const phase = converter.moonToPhase(current.moon);
    moon.classList = '';
    moon.classList.add('conditions-icon', phase);

    const sunrise = currentBottomContainer.querySelector('.sunrise > p');
    const sunriseTime = format(
      new Date('2024-11-23T' + current.sunrise),
      'h:mm aaa'
    );
    sunrise.textContent = sunriseTime;

    const sunset = currentBottomContainer.querySelector('.sunset > p');
    const sunsetTime = format(
      new Date('2024-11-23T' + current.sunset),
      'h:mm aaa'
    );
    sunset.textContent = sunsetTime;
  };

  const displayHourly = (hourly) => {
    hourly.slice(0, 11).forEach((hour) => {
      const containerDiv = document.createElement('div');
      const time = document.createElement('p');
      const icon = document.createElement('div');
      const precip = document.createElement('p');
      const temp = document.createElement('p');

      time.classList.add('time');
      const formattedTime = format(
        new TZDate('2024-11-23T' + hour.time, zone),
        'haaaaa'
      );
      time.textContent = formattedTime;

      icon.classList.add('conditions-icon', hour.icon + '-static');

      precip.classList.add('precip-prob');
      precip.textContent = hour.precipProb + '%';

      temp.classList.add('hourly-temp');
      temp.textContent = Math.round(hour.temp) + '°';

      containerDiv.appendChild(time);
      containerDiv.appendChild(icon);
      containerDiv.appendChild(precip);
      containerDiv.appendChild(temp);

      hourlyDiv.appendChild(containerDiv);
    });
  };

  const displayDaily = (daily) => {
    daily.forEach((day) => {
      const containerDiv = document.createElement('div');

      const dayOfWeek = document.createElement('p');
      const icon = document.createElement('div');
      const precip = document.createElement('p');
      const highLowTemp = document.createElement('div');

      dayOfWeek.classList.add('day-of-week');
      dayOfWeek.textContent = format(
        new TZDate(day.date + 'T00:00:00', zone),
        'E'
      );

      icon.classList.add('conditions-icon', day.icon + '-static');

      precip.classList.add('precip-prob');
      precip.textContent = Math.round(day.precipProb) + '%';

      highLowTemp.classList.add('high-low-temp');

      const highTemp = document.createElement('div');
      const highTitle = document.createElement('p');
      const highValue = document.createElement('p');
      highTitle.textContent = 'Hi:';
      highValue.textContent = Math.round(day.highTemp) + '°';
      highTemp.appendChild(highTitle);
      highTemp.appendChild(highValue);

      const lowTemp = document.createElement('div');
      const lowTitle = document.createElement('p');
      const lowValue = document.createElement('p');
      lowTitle.textContent = 'Lo:';
      lowValue.textContent = Math.round(day.lowTemp) + '°';
      lowTemp.appendChild(lowTitle);
      lowTemp.appendChild(lowValue);

      highLowTemp.appendChild(highTemp);
      highLowTemp.appendChild(lowTemp);

      containerDiv.appendChild(dayOfWeek);
      containerDiv.appendChild(icon);
      containerDiv.appendChild(precip);
      containerDiv.appendChild(highLowTemp);

      dailyDiv.appendChild(containerDiv);
    });
  };

  const updateMap = (lat, long) => {
    const newMap = map.getMap(lat + ',' + long);
    mapContainer.insertBefore(newMap, mapContainer.firstChild);
  };

  const updateTheme = (current) => {
    const currentTimeStr = format(TZDate.tz(zone), 'HH:mm:ss');

    // Make everything local TZ to compare
    // Too difficult to convert everything to target TZ
    const currentDT = new Date('2024-11-23T' + currentTimeStr);
    const sunriseDT = new Date('2024-11-23T' + current.sunrise);
    const sunsetDT = new Date('2024-11-23T' + current.sunset);

    if (currentDT < sunriseDT || currentDT > sunsetDT) {
      document.documentElement.classList = 'night';
    } else {
      document.documentElement.classList = '';
    }
  };

  const clearAllData = () => {
    hourlyDiv.textContent = '';
    dailyDiv.textContent = '';
    try {
      mapContainer.querySelector('iframe').remove();
    } catch {
      return;
    }
  };

  const updateAll = (data, units) => {
    clearAllData();

    zone = data.timezone;
    changeUnits(units);
    updateTheme(data.current);
    updateCurrentTop(data.current, data.resolvedAddress, data.daily[0]);
    updateCurrentBottom(data.current);
    updateMap(data.latitude, data.longitude);
    displayHourly(data.hourly);
    displayDaily(data.daily);
  };

  const showDialog = (myDialog) => {
    myDialog.showModal();
  };

  const hideDialog = (myDialog) => {
    myDialog.close();
  };

  const showInputError = () => {
    const msg = errorContainer.querySelector('.error-msg');
    msg.textContent = 'Please enter a valid location.';
    errorContainer.classList.remove('hidden');
  };

  const hideInputError = () => {
    errorContainer.classList.add('hidden');
  };

  return {
    updateAll,
    showDialog,
    hideDialog,
    showInputError,
    hideInputError,
  };
}

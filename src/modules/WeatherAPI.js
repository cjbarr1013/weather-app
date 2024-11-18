export function WeatherAPI(locInput = 'new york city, new york') {
  let units = ['us', 'metric'];
  const apiKey = 'FN2BWZ7KSKYMFFJCDC2C6BZBS';

  const getURL = (unit) => {
    const loc = encodeURIComponent(locInput); // Convert to url friendly string
    return (
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' +
      loc +
      '?unitGroup=' +
      unit +
      '&key=' +
      apiKey +
      '&contentType=json'
    );
  };

  const fetchJSON = async (unit) => {
    const url = getURL(unit);
    try {
      const response = await fetch(url, { mode: 'cors' });
      const rawData = await response.json();
      return await rawData;
    } catch {
      return {};
    }
  };

  // Organize information and return
  const parseJSON = (rawData) => {
    let currentHour = new Date().getHours(); // Returns value 0-23 (i.e. 8 = 9a)
    let hourly = [];
    let day = 0;
    for (let i = 0; i <= 23; i++) {
      if (currentHour === 24) {
        currentHour = 0;
        day++;
      }
      hourly.push({
        time: rawData['days'][day]['hours'][currentHour]['datetime'],
        temp: rawData['days'][day]['hours'][currentHour]['temp'],
        precipProb: rawData['days'][day]['hours'][currentHour]['precipprob'],
        precipType: rawData['days'][day]['hours'][currentHour]['preciptype'],
        conditions: rawData['days'][day]['hours'][currentHour]['conditions'],
        icon: rawData['days'][day]['hours'][currentHour]['icon'],
      });
      currentHour++;
    }

    let daily = [];
    for (let i = 0; i < 10; i++) {
      daily.push({
        date: rawData['days'][i]['datetime'],
        highTemp: rawData['days'][i]['tempmax'],
        lowTemp: rawData['days'][i]['tempmin'],
        precipProb: rawData['days'][i]['precipprob'],
        precipType: rawData['days'][i]['preciptype'],
        conditions: rawData['days'][i]['conditions'],
        icon: rawData['days'][i]['icon'],
      });
    }

    return {
      resolvedAddress: rawData['resolvedAddress'],
      latitude: rawData['latitude'],
      longitude: rawData['longitude'],
      current: {
        time: rawData['currentConditions']['datetime'],
        temp: rawData['currentConditions']['temp'],
        conditions: rawData['currentConditions']['conditions'],
        icon: rawData['currentConditions']['icon'],
        precipDepth: rawData['currentConditions']['precip'],
        precipProb: rawData['currentConditions']['precipprob'],
        snowDepth: rawData['currentConditions']['snowdepth'],
        precipType: rawData['currentConditions']['preciptype'],
        feelsLike: rawData['currentConditions']['feelslike'],
        visibility: rawData['currentConditions']['visibility'],
        uv: rawData['currentConditions']['uvindex'],
        humidity: rawData['currentConditions']['humidity'],
        dew: rawData['currentConditions']['dew'],
        sunrise: rawData['currentConditions']['sunrise'],
        sunset: rawData['currentConditions']['sunset'],
        moon: rawData['currentConditions']['moonphase'],
        windDirection: rawData['currentConditions']['winddir'],
        windSpeed: rawData['currentConditions']['windspeed'],
      },
      hourly: hourly,
      daily: daily,
    };
  };

  const getData = async () => {
    let data = {};
    for await (const unit of units) {
      const rawData = await fetchJSON(unit);
      if (Object.keys(rawData).length !== 0) {
        const parsedData = parseJSON(rawData);
        data[unit] = parsedData;
      } else {
        data[unit] = rawData;
      }
    }
    return data;
  };

  return {
    getData,
  };
}

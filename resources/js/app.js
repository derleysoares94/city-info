const search = document.getElementById('search');

search.addEventListener('click', async (event) => {
    event.preventDefault();
    const cityName          = document.getElementById('city').value;
    const inf               = document.getElementById('inf');
    const temp              = document.getElementById('temperature');
    const img               = document.getElementById('weather-img');
    const current_weather   = document.getElementById('cur-weather');
    const real_feel         = document.getElementById('real-feel');
    const wind              = document.getElementById('wind');
    const loader            = document.getElementById('loader');
    const weather_container = document.getElementById('weather-container');
    const city_title        = document.getElementById('city-name');
    const wrapper           = document.getElementById('wrapper');

    inf.innerHTML = '';
    city_title.innerText = '';
    loader.classList.remove("hide-loader");
    weather_container.style.display = "none";

    const cityInfo = await getCityInfo(cityName);

    const weather     = await getweather(cityInfo[0].latitude, cityInfo[0].longitude);
    const icon        = weather.weather[0].icon;
    const desc        = weather.weather[0].description;
    const feels_like  = weather.main.feels_like;
    const wind_speed  = weather.wind.speed;
    const temperature = weather.main.temp;

    temp.innerText            = temperature;
    img.src                   = `https://derleysoares94.github.io/city-info/resources/img/weather-icon/${icon}.png`;
    current_weather.innerText = desc;
    real_feel.innerText       = feels_like;
    wind.innerText            = wind_speed;

    const histories = await getHistory(cityName);
    city_title.innerText = cityName;
    document.getElementById('city').value = '';

    if (histories.length !== 0) {
        histories.forEach(history => {
            let text = `${history.day}/${history.month}/${history.year} Event: ${history.event}` + "<br>";
            inf.innerHTML += text + "<br>";
        });
        loader.classList.add("hide-loader");
        weather_container.style.display = "flex";
    } else {
        loader.classList.add("hide-loader");
        inf.innerHTML = `Sorry, we could not find any history event for ${cityName}`;
        weather_container.style.display = "flex";
    }
});

//Get the cities info, to be possible use the free version of the API we need to get the latitude and longitude.
async function getCityInfo(city) {
    const url = `https://api.api-ninjas.com/v1/city?name=${city}`;
    const result = await fetch(url,
    {
        method: 'GET',
        headers: { 'X-Api-Key': 'SxHy1r0kNeQbdwEnBAUDeQ==XiZ38nUgTDZrQmc8' },
    })
    .then(response => response.json())
    .then(data => { return data })
    .catch(error => console.error(error));    
    
    return result;
}

//Get historical events of the cities.
async function getHistory(city) {    
    const url = `https://api.api-ninjas.com/v1/historicalevents?text=${city}`;
    const result = await fetch(url,
    {
        method: 'GET',
        headers: {'X-Api-Key': 'SxHy1r0kNeQbdwEnBAUDeQ==XiZ38nUgTDZrQmc8'},
    })
    .then(response => response.json())
    .then(data => { return data; })
    .catch(error => console.error(error));

    return result;
}

//Get weather forecast of the city using latitude and longitude.
async function getweather(lat, lon) {
    const key = '115f8ede73325a9df6cd7c03106ebadd';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const result = await fetch(url,
        {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => { return data })
        .catch(error => console.error(error));

    return result;
}
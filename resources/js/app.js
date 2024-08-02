const search = document.getElementById('search');

search.addEventListener('click', async (event) => {
    event.preventDefault();
    const cityName          = document.getElementById('city').value;
    const inf               = document.getElementById('inf');
    const temp              = document.getElementById('temperature');
    const img               = document.getElementById('wheater-img');
    const current_weather   = document.getElementById('cur-weather');
    const real_feel         = document.getElementById('real-feel');
    const wind              = document.getElementById('wind');
    const loader            = document.getElementById('loader');
    const weather_container = document.getElementById('weather-container');

    inf.innerHTML = '';
    loader.classList.remove("hide-loader");
    weather_container.style.display = "none";

    const cityInfo = await getCityInfo(cityName);

    const weather     = await getWheater(cityInfo[0].latitude, cityInfo[0].longitude);
    const icon        = weather.weather[0].icon;
    const desc        = weather.weather[0].description;
    const feels_like  = weather.main.feels_like;
    const wind_speed  = weather.wind.speed;
    const temperature = weather.main.temp;

    temp.innerText            = temperature;
    img.src                   = `/resources/img/wheater-icon/${icon}.png`;
    current_weather.innerText = desc;
    real_feel.innerText       = feels_like;
    wind.innerText            = wind_speed;

    const histories = await getHistory(cityName);

    if (histories.length !== 0) {
        histories.forEach(history => {
            let text = `${history.day}/${history.month}/${history.year} Event: ${history.event}` + "<br>";
            inf.innerHTML += text + "<br>";
            //typingText(text, document.getElementById('inf'));
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

//Get wheater forecast of the city using latitude and longitude.
async function getWheater(lat, lon) {
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

//Pretending that we are typing
async function typingText(text, element, delay = 80) {
    const letters = text.split('');

    let i = 0;
    while(i < letters.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
        element.innerHTML += letters[i];
        i++;
    }
    return;
}
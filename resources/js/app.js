const search = document.getElementById('search');

search.addEventListener('click', async (event) => {
    event.preventDefault();
    const cityName = document.getElementById('city').value;
    const inf = document.getElementById('inf');
    const loader = document.getElementById('loader');

    inf.innerHTML = '';
    loader.classList.remove("hide-loader");

    const result = await getHistory(cityName);

    //Adding the historial text to the info container.
    if(result.length !== 0) {
        result.forEach(history => {
            let text = `${history.day}/${history.month}/${history.year} Event: ${history.event}` + "<br>";
            loader.classList.add("hide-loader");
            inf.innerHTML += text + "<br>";
            //typingText(text, document.getElementById('inf'));
        });
    } else {
        loader.classList.add("hide-loader");
        inf.innerHTML = `Sorry, we could not find any history event for ${cityName}`;
    }
});

//Get the cities info, its necessary to fetch the weather forecast.
async function getCityInf(city) {    
    const url = `https://api.api-ninjas.com/v1/city?name=${city}`;
    const result = await fetch(url,
    {
        method: 'GET',
        headers: { 'X-Api-Key': 'SxHy1r0kNeQbdwEnBAUDeQ==XiZ38nUgTDZrQmc8' },
    })
    .then(response => {response.json()})
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
    .then(data => { 
        console.log(data); 
        return data; 
    })
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
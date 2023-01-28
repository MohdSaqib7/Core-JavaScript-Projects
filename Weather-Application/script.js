const searchInput = document.getElementById('search_input');
const searchButton = document.getElementById('search_button');
const userLocation = document.getElementById('userlocation');

const cityName = document.getElementById('city_name');
const weatherImage = document.getElementById('weather_image');
const season = document.getElementById('season');
const temperatureBlock = document.getElementById('temperature');
const windSpeedBlock = document.getElementById('wind_speed');
const humidityBlock = document.getElementById('humidity');
const cloudinessBlock = document.getElementById('cloudiness');

init()

function init() {
    userLocation.addEventListener('click', userCurrentLocation)
    searchButton.addEventListener('click', fetchWeatherUsingCity)
}


async function fetchWeatherUsingCity() {
    const location = searchInput.value;
    const apiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d8ab14f7e93c56cbe84562d28e8202bd&units=metric`);
    const jsonData = await apiResponse.json()
    renderUI(jsonData)
}

function userCurrentLocation() {
    navigator.geolocation.getCurrentPosition((data) => {
        const {latitude, longitude} = data.coords 
        fetchWeatherUsingLatitudeLongitude(latitude, longitude)
    })
}

async function fetchWeatherUsingLatitudeLongitude(latitude, longitude) {
    const apiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d8ab14f7e93c56cbe84562d28e8202bd&units=metric`);
    const jsonData = await apiResponse.json()
    renderUI(jsonData);
    searchInput.value = jsonData.name
}

function renderUI(jsonData) {
    const city = jsonData.name
    const weatherDescription = jsonData.weather[0].description
    const weatherIcon = jsonData.weather[0].icon
    const temperature = jsonData.main.temp
    const windSpeed = jsonData.wind.speed
    const humidity = jsonData.main.humidity
    const cloudiness = jsonData.clouds.all

    cityName.innerText = city
    weatherImage.setAttribute('src', `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
    season.innerText = weatherDescription
    temperatureBlock.innerHTML = `${temperature}&deg;C`
    windSpeedBlock.innerText = windSpeed
    humidityBlock.innerText = humidity
    cloudinessBlock.innerText = cloudiness
}
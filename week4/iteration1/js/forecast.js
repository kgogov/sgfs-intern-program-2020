const apiKey = 'aa176f47832a38856a3e010195dfc7b2';

const weatherIconContainer = document.querySelector('.weather-icon--container');
const weatherCity = document.querySelector('.weather-location-city');
const weatherCountry = document.querySelector('.weather-location-countryTag');
const weatherDegree = document.querySelector('.weather-temperature-degree');
const weatherDescription = document.querySelector('.weather-description-full');
const weatherFeelsLike = document.querySelector('.weather-description-feels-like');

const getWeatherData = () => {
    window.addEventListener('load', () => {
        let longitude;
        let latitude;
        
        // Handle error
        if (!navigator.geolocation) {
            console.log('Info message');
        }
    
        navigator.geolocation.getCurrentPosition(position => {
            longitude   = position.coords.longitude;
            latitude    = position.coords.latitude
    
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const cityName = data.name;
                    const countyTag = data.sys.country;
                    const temp = data.main.temp;
                    const weatherFullInfo  = data.weather[0].description;
                    const feelsLikeText = data.main.feels_like;
    
                    weatherCity.textContent = cityName;
                    weatherCountry.textContent = countyTag;
                    weatherDegree.innerHTML = `${Math.round(temp)} C &deg;`;
                    weatherFeelsLike.innerHTML = `feels like <span class='weather-feels-like-text'>${Math.round(feelsLikeText)} C &deg;</span>`;
                    weatherDescription.textContent = weatherFullInfo;

                    return data;
                })
                .then (data => {
                    const weatherIcon = data.weather[0].icon;
                    const weatherAltDescription = data.weather[0].main;

                    fetch(`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
                        .then(response => {
                            const image = document.createElement('img');
                            image.src = response.url;
                            image.alt = weatherAltDescription;
                            weatherIconContainer.insertAdjacentElement('afterbegin', image);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }) 
                .catch(err => {
                    console.log(err);
                });
            
        });
    });
}

getWeatherData();
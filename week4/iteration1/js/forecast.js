const apiKey                        = 'aa176f47832a38856a3e010195dfc7b2';

const weatherContainer              = KQ('.weather-container');
const calendarEventListContainer    = KQ('.calendar-events-list--container');

const weatherIconContainer          = KQ('.weather-icon--container');
const weatherCity                   = KQ('.weather-location-city');
const weatherCountry                = KQ('.weather-location-countryTag');
const weatherDegree                 = KQ('.weather-temperature-degree');
const weatherDescription            = KQ('.weather-description-full');
const weatherFeelsLike              = KQ('.weather-description-feels-like');

const success = (position) => {
    const longitude   = position.coords.longitude;
    const latitude    = position.coords.latitude

    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const cityName                  = data.name;
            const countyTag                 = data.sys.country;
            const temp                      = data.main.temp;
            const weatherFullInfo           = data.weather[0].description;
            const feelsLikeText             = data.main.feels_like;

            weatherCity.text(cityName);
            weatherCountry.text(countyTag);
            weatherDescription.text(weatherFullInfo);
            
            weatherDegree.html(`${Math.round(temp)} C &deg;`); 
            weatherFeelsLike.html(`feels like <span class='weather-feels-like-text'>${Math.round(feelsLikeText)} C &deg;</span>`); 

            return data;
        })
        .then (data => {
            const weatherIcon               = data.weather[0].icon;
            const weatherAltDescription     = data.weather[0].main;

            fetch(`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
                .then(response => {
                    const image             = document.createElement('img');
                    image.src               = response.url;
                    image.alt               = weatherAltDescription;
                    
                    weatherIconContainer.valueOf().prepend(image);
                })
                .catch(err => {
                    console.warn(err);
                })
        }) 
        .catch(err => {
            console.warn(err);
    });
}

const error = () => {
    calendarEventListContainer.addClass('inactive-weather-layout');
}

const getWeatherData = () => {
    window.addEventListener('load', () => {
        if (!navigator.geolocation) {
            showAlert('geolocation-error');
            error();
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    });
}
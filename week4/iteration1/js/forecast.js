const apiKey                        = 'aa176f47832a38856a3e010195dfc7b2';

const weatherContainer              = document.querySelector('.weather-container');
const calendarEventListContainer    = document.querySelector('.calendar-events-list--container');

const weatherIconContainer          = document.querySelector('.weather-icon--container');
const weatherCity                   = document.querySelector('.weather-location-city');
const weatherCountry                = document.querySelector('.weather-location-countryTag');
const weatherDegree                 = document.querySelector('.weather-temperature-degree');
const weatherDescription            = document.querySelector('.weather-description-full');
const weatherFeelsLike              = document.querySelector('.weather-description-feels-like');

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

                weatherCity.textContent         = cityName;
                weatherCountry.textContent      = countyTag;
                weatherDescription.textContent  = weatherFullInfo;
                weatherDegree.innerHTML         = `${Math.round(temp)} C &deg;`;
                weatherFeelsLike.innerHTML      = `feels like <span class='weather-feels-like-text'>${Math.round(feelsLikeText)} C &deg;</span>`;

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
                        weatherIconContainer.insertAdjacentElement('afterbegin', image);
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
    calendarEventListContainer.classList.add('inactive-weather-layout');
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
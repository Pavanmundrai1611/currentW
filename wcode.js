document.addEventListener('DOMContentLoaded', () => {
    let isCelsius = true;
    var temperatureUnit = isCelsius ? '&#8451;' : '&#8457;';
    const apiKey = '0752aac82d8dfcb00d18a0be6916b4e4';

    const weatherSection = document.querySelector('.weather-section');
    const manualLocationInput = document.querySelector('.manuallocation');
    const automaticLocationButton = document.getElementById('automaticlocation');
    const submitButton = document.getElementById('submit-button');

    let selectedLocation = null;

    manualLocationInput.addEventListener('input', function () {
        selectedLocation = manualLocationInput.value;
        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
    });

    function handleLocationError(error) {
        console.error('Error getting location:', error);
        selectedLocation = "Location could not be determined. Enter again";
        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
    }

    automaticLocationButton.addEventListener('click', function () {
        // Get the user's location using Geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const apiUrl1 = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;

                fetch(apiUrl1)
                    .then(response => response.json())
                    .then(data => {
                        if (data.address && data.address.town) {
                            selectedLocation = data.address.town;
                        } else {
                            selectedLocation = 'Town not found';
                        }
                        document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
                    })
                    .catch(handleLocationError);
            }, handleLocationError);
        } else {
            selectedLocation = "Geolocation is not supported by this browser.";
            document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
        }
    });


    submitButton.addEventListener('click', function () {
        if (selectedLocation !== null) {
            document.querySelector('.location-input').innerHTML = `<h2>Selected location : ${selectedLocation}</h2>`;
            getWeather(selectedLocation);
        } else {
            alert("Please enter a location");
        }
    });


    async function getWeather(location) {
        try {
            weatherSection.innerHTML = '';
            const loading = createLoadingElement();
            weatherSection.appendChild(loading);
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            console.log(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
            displayWeather(data);
            loading.remove();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            errorDiv.textContent = 'Unable to fetch weather data. Please check the location and try again.';
            weatherSection.appendChild(errorDiv);
            loading.remove();
        }
    }
    function createLoadingElement() {
        const loading = document.createElement('div');
        loading.classList.add('loading');
        return loading;
    }

    function displayWeather(data) {
        if (!data.main || !data.weather || !data.weather[0]) {
            weatherSection.innerHTML = '<h2>Weather data not available</h2>';
            return;
        }
        const temperature = data.main.temp;
        const conditions = data.weather[0].description;
        const icon = data.weather[0].icon;
        const temperatureUnit = isCelsius ? '&#8451;' : '&#8457;';
        const temperatureValue = isCelsius ? temperature : (temperature * 1.8 + 32).toFixed(1);
        const weatherHTML = `
            <h2>  Current Weather : </h2>
            <h3> Temperature: ${temperatureValue} ${temperatureUnit}</h3>
            <h3> Conditions: ${conditions}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="wimg" alt="Weather Icon">
        `;
        weatherSection.innerHTML = weatherHTML;
    }



    const checkbox = document.getElementById('bopis');
    checkbox.addEventListener('change', function () {
        isCelsius = !isCelsius; // Toggle the temperature unit
        temperatureUnit = isCelsius ? '&#8451;' : '&#8457;';
        
    });
});
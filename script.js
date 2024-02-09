// Zaktualizowany kod funkcji fetchWeather z uwzględnieniem klucza API
async function fetchWeather(cityName) {
    const apiKey = 'bc419db26672442912f81b323545a4e3'; // Zaktualizowany klucz API
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Błąd podczas pobierania danych pogodowych:', error);
        return null;
    }
}

// Pobranie elementów z DOM
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
const citiesList = document.getElementById('citiesList');

// Funkcja do wyświetlania danych pogodowych
function displayWeather(cityName, temperature, humidity, weatherIcon) {
    const cityWeather = document.createElement('div');
    cityWeather.classList.add('city-weather');
    cityWeather.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperatura: ${temperature}°C</p>
        <p>Wilgotność: ${humidity}%</p>
        <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Ikona Pogody">
        <button class="remove-btn">Usuń</button>
    `;
    citiesList.appendChild(cityWeather);
}

// Obsługa dodawania miasta
addCityBtn.addEventListener('click', async () => {
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        const weatherData = await fetchWeather(cityName);
        if (weatherData) {
            const { main, weather } = weatherData;
            if (main && weather && weather.length > 0) {
                const temperature = main.temp;
                const humidity = main.humidity;
                const weatherIcon = weather[0].icon;
                displayWeather(cityName, temperature, humidity, weatherIcon);
                cityInput.value = '';
                // Zapisanie dodanego miasta do localStorage
                const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
                savedCities.push(cityName);
                localStorage.setItem('cities', JSON.stringify(savedCities));
            } else {
                alert('Brak informacji o pogodzie dla podanego miasta.');
            }
        } else {
            alert('Nie można znaleźć danych dla podanego miasta. Spróbuj ponownie.');
        }
    } else {
        alert('Wprowadź nazwę miasta.');
    }
});

// Funkcja do usuwania miasta z listy
function removeCity(event) {
    if (event.target.classList.contains('remove-btn')) {
        const cityToRemove = event.target.parentElement;
        const cityName = cityToRemove.querySelector('h2').textContent;
        cityToRemove.remove();
        // Usunięcie miasta z localStorage
        const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
        const updatedCities = savedCities.filter(city => city !== cityName);
        localStorage.setItem('cities', JSON.stringify(updatedCities));
    }
}

// Obsługa usuwania miasta
citiesList.addEventListener('click', removeCity);

// Funkcja do wczytania zapisanych miast z localStorage
function loadSavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    savedCities.forEach(async city => {
        const weatherData = await fetchWeather(city);
        if (weatherData) {
            const { main, weather } = weatherData;
            if (main && weather && weather.length > 0) {
                const temperature = main.temp;
                const humidity = main.humidity;
                const weatherIcon = weather[0].icon;
                displayWeather(city, temperature, humidity, weatherIcon);
            }
        }
    });
}

// Wczytanie zapisanych miast po załadowaniu strony
window.addEventListener('DOMContentLoaded', loadSavedCities);

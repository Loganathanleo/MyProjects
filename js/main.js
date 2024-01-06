document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "9ea0e43fcb228dd2550c3ef17b2e077a";
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";
    const csvFileUrl = "../city_coordinates.csv";
    let cities = [];

    fetch(csvFileUrl)
        .then((response) => response.text())
        .then((csvData) => {
            cities = parseCsv(csvData);
            console.log("Cities:", cities); // Add this line for debugging
            populateDropdown();
        })
        .catch((error) => {
            console.error("Error fetching CSV file:", error);
        });

    function parseCsv(csvData) {
        const lines = csvData.split('\n');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(',');
            if (data.length === 4) {
                const lat = parseFloat(data[0].trim());
                const lon = parseFloat(data[1].trim());
                const city = data[2].trim();
                const country = data[3].trim();
                result.push({ lat, lon, city, country });
            }
        }

        return result;
    }

    function populateDropdown() {
        const dropdown = document.getElementById("cityDropdown");
    
        cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = `${city.city},${city.country}`;
            option.text = `${city.city}, ${city.country}`;
            dropdown.add(option);
        });
    
        dropdown.addEventListener("change", function () {
            const selectedCity = dropdown.value;
            getWeather(selectedCity);
        });
    }
    

    function getWeather(city) {
        const url = `${apiUrl}?q=${city}&appid=${apiKey}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                displayWeather(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function displayWeather(data) {
        const weatherContainer = document.getElementById("weatherContainer");

        weatherContainer.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            const forecastElement = document.createElement("div");
            forecastElement.classList.add("forecast");

            forecastElement.innerHTML = `
                <h2>${formatDate(data.list[i].dt)}</h2>
                <p>Temperature: ${data.list[i].main.temp}°C</p>
                <p>Weather: ${data.list[i].weather[0].description}</p>
            `;

            weatherContainer.appendChild(forecastElement);
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
});

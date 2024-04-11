import React, { useEffect, useState } from "react";
import "./App.css";
import { LiaCloudSunRainSolid } from "react-icons/lia";
import { TiWeatherCloudy, TiWeatherWindyCloudy } from "react-icons/ti";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";
import axios from "axios";

function Table() {
  const [tableData, setTableData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_KEY = "9ea0e43fcb228dd2550c3ef17b2e077a";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100"
      );
      const data = res.data.results;
      setTableData(data);
      console.log(data, "Data..........");
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const fetchWeatherData = async (cityName) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
      );
      setWeatherData(res.data);
      console.log(res.data, "Weather Data......");
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const handleSelect = (cityName) => {
    setSelectedCity(cityName);
    fetchWeatherData(cityName);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const hasNextPage = indexOfLastItem < tableData.length;

  const getWeatherBackgroundClass = (weatherData) => {
    if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
      const weatherDescription =
        weatherData.weather[0].description.toLowerCase();

      if (weatherDescription.includes("scattered clouds")) {
        return "scattered-clouds";
      } else if (weatherDescription.includes("overcast clouds")) {
        return "cloudy";
      } else if (weatherDescription.includes("broken clouds")) {
        return "broken-clouds";
      } else if (weatherDescription.includes("few clouds")) {
        return "few-clouds";
      } else {
        return "clear-sky";
      }
    }
    return "";
  };

  return (
    <div className={`weather ${getWeatherBackgroundClass(weatherData)}`}>
      <div className="content">
        <h1>Weather ForeCast</h1>
        {/* {console.log(tableData, ",,,,,,,,,,,,,,,,,,,,,")} */}
        <p>
          <strong>Note:</strong> Click the{" "}
          <em>
            <b>City Name</b>
          </em>{" "}
          to know the weather forecast of that city....{" "}
        </p>
        <table className="tableContent">
          <thead>
            <tr className="rowItems">
              <th>City Name</th>
              <th>Country Name</th>
              <th>Counthy Code</th>
              <th>Population</th>
              <th>Time Zone</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="rowItems">
                <td onClick={() => handleSelect(item.ascii_name)}>
                  {item.ascii_name}
                </td>
                <td>{item.cou_name_en}</td>
                <td>{item.country_code}</td>
                <td>{item.population}</td>
                <td>{item.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="buttons">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
          </button>
        </div>
      </div>

      <div>
        {selectedCity && (
          <div className="weatherContent">
            <h2>Weather Forecast for {selectedCity}</h2>
            {weatherData && (
              <div>
                <p>
                  Description: <LiaCloudSunRainSolid />{" "}
                  {weatherData.weather[0].description}
                </p>
                <p>
                  Average Temperature: <FaTemperatureHigh />{" "}
                  {weatherData.main.temp}
                </p>
                <p>
                  Feels Like: <TiWeatherCloudy /> {weatherData.main.feels_like}
                </p>
                <p>
                  Minimum Temperature: <FaTemperatureArrowDown />{" "}
                  {weatherData.main.temp_min}
                </p>
                <p>
                  Maximum Temperature: <FaTemperatureArrowUp />{" "}
                  {weatherData.main.temp_max}
                </p>
                <p>
                  Humidity: <WiHumidity /> {weatherData.main.humidity}
                </p>
                <p>
                  Wind Speed: <TiWeatherWindyCloudy /> {weatherData.wind.speed}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;

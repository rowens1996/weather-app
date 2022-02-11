import React, { useState, useEffect } from "react";
import * as moment from "moment";
import { ApiClient } from "./ApiClient";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

function App() {
  const [currentWeather, cCurrentWeather] = useState({});
  const [sevenDayWeather, cSevenDayWeather] = useState([
    {
      date: "",
      tag: "",
      description: "",
      tempmin: "",
      tempmax: "",
      humidity: "",
      cloud: "",
      windSpeed: "",
      icon: "",
    },
  ]);
  const [fetching, cFetching] = useState(false);
  const [location, cLocation] = useState({
    lat: "53.3806626",
    lon: "-1.4702278",
  });
  const [cityInput, cCityInput] = useState({
    city: "Sheffield",
  });
  const apiClient = new ApiClient();

  const updateCity = (event) => {
    event.preventDefault();
    let input = document.getElementById("cityInput").value;
    cCityInput({
      city: input,
    });
    // console.log(`You just entered`, input);
    refreshLocation();
  };

  //callback function
  const updateCurrentWeather = (response) => {
    cCurrentWeather({
      //changes the state to the wanted parts from the api
      date: response.dt,
      tag: response.weather[0].main,
      description: response.weather[0].description,
      temp: response.temp,
      feelTemp: response.feels_like,
      humidity: response.humidity,
      cloud: response.clouds,
      windSpeed: response.wind_speed,
      icon: `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
    });
    // console.log(response.dt);
  };

  const updateSevenDayWeather = (response) => {
    const sevendaylist = response.daily.map((weather) => ({
      //changes the state to the wanted parts from the api
      date: weather.dt,
      tag: weather.weather[0].main,
      description: weather.weather[0].description,
      tempmin: weather.temp.min,
      tempmax: weather.temp.max,
      humidity: weather.humidity,
      cloud: weather.clouds,
      windSpeed: weather.wind_speed,
      icon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
    }));
    cSevenDayWeather(sevendaylist);
    console.log(sevendaylist);
  };

  const updateLocation = (response) => {
    cLocation({
      lat: response.lat,
      lon: response.lon,
    });
  };

  const refreshLocation = () => {
    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getLocation(cityInput)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        updateLocation(res.data[0]);
      })
      //display error message if error found in check
      .catch((error) => {
        //gives red cross to show its and error doesnt tell user not the best error handling
        console.error(error);
      })
      //undisable button after quote has been rendered
      .finally(cFetching(false));
  };

  const refreshSevenDayWeather = () => {
    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getSevenDayWeather(location)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        updateSevenDayWeather(res.data);
        updateCurrentWeather(res.data.current);
        console.log(`sevendayweather array`, res.data);
        // console.log(`currentweather array`, res.data.current);
      })
      //display error message if error found in check
      .catch((error) => {
        //gives red cross to show its and error doesnt tell user not the best error handling
        console.error(error);
      })
      //undisable button after quote has been rendered
      .finally(cFetching(false));
  };

  useEffect(() => {
    //disable error for the square brackets you dont want to re-run the function after everychange in this case
    refreshSevenDayWeather();
  }, [location]);

  const buildSevenDayWeather = () => {
    return sevenDayWeather.slice(1).map((dayWeather, index) => {
      return (
        <div key={index}>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" className="icon" src={dayWeather.icon} />
            <Card.Body>
              <Card.Title>
                {moment(dayWeather.date * 1000).format("dddd")}
              </Card.Title>
              <Card.Text>
                {dayWeather.tag} {dayWeather.description}
                <br />
                Temp Min: {dayWeather.tempmin} <sup>o</sup>C <br />
                Temp Max: {dayWeather.tempmax} <sup>o</sup>C <br />
                WindSpeed: {dayWeather.windSpeed} m/s <br />
                Humidity:{" "}
                <ProgressBar
                  animated
                  now={dayWeather.humidity}
                  label={`${dayWeather.humidity}%`}
                />
                Cloud Coverage:{" "}
                <ProgressBar
                  animated
                  variant="info"
                  now={dayWeather.cloud}
                  label={`${dayWeather.cloud}%`}
                />
              </Card.Text>
              <Button variant="primary">More Info</Button>
            </Card.Body>
          </Card>
        </div>
      );
    });
  };

  return (
    <Container>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" className="icon" src={currentWeather.icon} />
        <Card.Body>
          <Card.Title>The weather currently in {cityInput.city}</Card.Title>
          <Card.Text>
            Date: {moment(currentWeather.date * 1000).format("ll")}
            <br />
            {currentWeather.tag} {currentWeather.description}
            <br />
            Temp: {currentWeather.temp} <sup>o</sup>C <br />
            Feels Like: {currentWeather.feelTemp} <sup>o</sup>C <br />
            WindSpeed: {currentWeather.windSpeed} m/s <br />
            Humidity:{" "}
            <ProgressBar
              animated
              now={currentWeather.humidity}
              label={`${currentWeather.humidity}%`}
            />
            Cloud Coverage:{" "}
            <ProgressBar
              animated
              variant="info"
              now={currentWeather.cloud}
              label={`${currentWeather.cloud}%`}
            />
          </Card.Text>
          <Button variant="primary">More Info</Button>
        </Card.Body>
      </Card>
      {buildSevenDayWeather()}
    </Container>
  );
}

{/* <form>
  <input type="text" id="cityInput" placeholder="Type City Here" />
  <button onClick={(event) => updateCity(event)}>Update City</button>
</form>; */}

export default App;

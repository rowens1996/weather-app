import React, { useState, useEffect } from "react";
import * as moment from 'moment'
import axios from "axios";
import { ApiClient } from "./ApiClient";
import "./App.css";

import WeatherCard from "./WeatherCard";



function App() {
  const [currentWeather, cCurrentWeather] = useState({
    date: "",
    tag: "",
    description: "",
    temp: "",
    feelTemp: "",
    humidity: "",
    cloud: "",
    windSpeed: "",
  });

  const [fiveDayWeather, cFiveDayWeather] = useState([]);

  const [fetching, cFetching] = useState(false);
  const [location, cLocation] = useState({
    lat: "",
    lon: "",
  });
  const [cityInput, cCityInput] = useState({
    city: "Sheffield",
  });
  const apiClient = new ApiClient();

  const updateCity = (event) => {
    event.preventDefault();
    let input = document.getElementById("cityInput").value;
    cCityInput({
      city: input
    })
    console.log(`You just entered`, input);
    refreshLocation();
  };

  //callback function
  const updateCurrentWeather = (jsonResponse) => {
    cCurrentWeather({
      //changes the state to the wanted parts from the api
      dt: jsonResponse.dt,
      tag: jsonResponse.weather[0].main,
      description: jsonResponse.weather[0].description,
      temp: jsonResponse.main.temp,
      feelTemp: jsonResponse.main.feels_like,
      humidity: jsonResponse.main.humidity,
      cloud: jsonResponse.clouds.all,
      windSpeed: jsonResponse.wind.speed,
    });
  };

  const updateFiveDayWeather = (response) => {
    const fivedaylist = response.daily.map((weather) => ({
      //changes the state to the wanted parts from the api
      dt: weather.dt,
      tag: weather.weather[0].main,
      description: weather.weather[0].description,
      tempmin: weather.temp.min,
      tempmax: weather.temp.max,
      humidity: weather.humidity,
      cloud: weather.clouds,
      windSpeed: weather.wind_speed,
    }));
    cFiveDayWeather(fivedaylist)
    console.log(fivedaylist);
      
    
  };
  
  const updateLocation = (response) => {
    cLocation({
      lat: response.lat,
      lon: response.lon,
    });
    console.log(`Update location lat `, response.lat)
    console.log(`Update location lon `, response.lon)
  };

  const refreshLocation = () => {
    cLocation({
      //default placeholder quote if api is fast this could replace the response this must be above the response
      lat: "not loaded yet",
      lon: "not loaded yet",
    });

    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getLocation(cityInput)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //.then((res) => res.json())
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        console.log(res.data[0])
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

  const refreshCurrentWeather = () => {
    cCurrentWeather({
      //default placeholder quote if api is fast this could replace the response this must be above the response
      date: "Loading....",
        tag: "Loading....",
        description: "Loading....",
        temp: "Loading....",
        feelTemp: "Loading....",
        humidity: "Loading....",
        cloud: "Loading....",
        windSpeed: "Loading....",
    });

    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getCurrentWeather(location)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //.then((res) => res.json())
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        updateCurrentWeather(res.data);
      })
      //display error message if error found in check
      .catch((error) => {
        //gives red cross to show its and error doesnt tell user not the best error handling
        console.error(error);
      })
      //undisable button after quote has been rendered
      .finally(cFetching(false));
  };

  const refreshFiveDayWeather = () => {
    cFiveDayWeather({
      //default placeholder quote if api is fast this could replace the response this must be above the response

    });

    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getFiveDayWeather(location)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //.then((res) => res.json())
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        updateFiveDayWeather(res.data);
        console.log(res.data)
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
    refreshLocation();
    // eslint-disable-next-line
  }, []);

    useEffect(() => {
    //disable error for the square brackets you dont want to re-run the function after everychange in this case
    refreshCurrentWeather();
    // refreshFiveDayWeather();
    // eslint-disable-next-line
  }, [location]);
  
  return (
    <div className="App">
      Hello the weather today in {cityInput.city}  is <br />
      <p></p>
      <p>Date: {moment(currentWeather.date).format('ll')}</p>
      <p>{currentWeather.tag} {currentWeather.description}</p>
      <p>Cloud Coverage: {currentWeather.cloud}%</p>
      <p>Temp: {currentWeather.temp} <sup>o</sup>C </p>
      <p>Feels Like: {currentWeather.feelTemp} <sup>o</sup>C </p>
      <p>Humidity: {currentWeather.humidity}%</p>
      <p>WindSpeed: {currentWeather.windSpeed} meter/sec</p>
      
      <button disabled={fetching} onClick={() => refreshCurrentWeather()}>
        Update
      </button>
      <form>
        <input type="text" id="cityInput" placeholder="Type City Here"/>
         <button onClick={(event)=>updateCity(event)}>Update City</button>
    </form>
    </div>
    
  );
}

export default App;

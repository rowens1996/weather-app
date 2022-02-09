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
    cloud: "",
    windSpeed: "",
    windDirection: "",
  });

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
    console.log(input);
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
      cloud: jsonResponse.clouds.all,
      windSpeed: jsonResponse.wind.speed,
      windDirection: jsonResponse.wind.direction,
    });
  };
  const updateLocation = (response) => {
    cLocation({
      lat: response.lat,
      lon: response.lon,
    });
    console.log(response.lat)
    console.log(response.lon)
  };

  const refreshLocation = () => {
    cLocation({
      //default placeholder quote if api is fast this could replace the response this must be above the response
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
      date: "Loading...",
      tag: "",
      description: "",
      temp: "",
      feelTemp: "",
      cloud: "",
      windSpeed: "",
      windDirection: "",
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
  
  
    useEffect(() => {
    //disable error for the square brackets you dont want to re-run the function after everychange in this case
    refreshLocation();
    refreshCurrentWeather();
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className="App">
      Hello the weather today in {cityInput.city}  is <br />
      <p></p>
      <p>Date: {moment(currentWeather.date).format('ll')}</p>
      <p>{currentWeather.tag} {currentWeather.description}</p>
      <p>Cloud Coverage: {currentWeather.cloud}%</p>
      <p>Temp: {currentWeather.temp - 273} <sup>o</sup>C </p>
      <p>Feels Like: {currentWeather.feelTemp} UNITS</p>
      <p>WindSpeed: {currentWeather.windSpeed} UNITS </p>
      
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

import React, { useState, useEffect } from "react";
import * as moment from "moment";
import axios from "axios";
import { ApiClient } from "./ApiClient";
import "./App.css";

import WeatherCard from "./WeatherCard";

function App() {
  const [currentWeather, cCurrentWeather] = useState({});
  const [sevenDayWeather, cSevenDayWeather] = useState([
    {
      dt: "",
      tag: "",
      description: "",
      tempmin: "",
      tempmax: "",
      humidity: "",
      cloud: "",
      windSpeed: "",
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
      dt: response.dt,
      tag: response.weather[0].main,
      description: response.weather[0].description,
      temp: response.temp,
      feelTemp: response.feels_like,
      humidity: response.humidity,
      cloud: response.clouds,
      windSpeed: response.wind_speed,
    });
    // console.log(response.dt);
  };

  const updateSevenDayWeather = (response) => {
    const sevendaylist = response.daily.map((weather) => ({
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
    cSevenDayWeather(sevendaylist);
    console.log(sevendaylist);
    // console.log(sevendaylist[0].dt);
  };

  const updateLocation = (response) => {
    cLocation({
      lat: response.lat,
      lon: response.lon,
    });
    // console.log(`Update location lat `, response.lat);
    // console.log(`Update location lon `, response.lon);
  };

  const refreshLocation = () => {
    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getLocation(cityInput)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //.then((res) => res.json())
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        // console.log(res.data[0]);
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

  // const refreshCurrentWeather = () => {
  //   cCurrentWeather({
  //     //default placeholder quote if api is fast this could replace the response this must be above the response
  //     date: "Loading....",
  //     tag: "Loading....",
  //     description: "Loading....",
  //     temp: "Loading....",
  //     feelTemp: "Loading....",
  //     humidity: "Loading....",
  //     cloud: "Loading....",
  //     windSpeed: "Loading....",
  //   });

  //   //fetching stops overloading api
  //   cFetching(true);
  //   //get response from api usingn axios
  //   apiClient
  //     .getCurrentWeather(location)
  //     // if no axios using get once reponse has been recieved pass it into function to convert to json
  //     //.then((res) => res.json())
  //     //passes it into function updateQuote .data needed when axios
  //     .then((res) => {
  //       updateCurrentWeather(res.data);
  //       // console.log(`currentweather array`, res.data);
  //     })
  //     //display error message if error found in check
  //     .catch((error) => {
  //       //gives red cross to show its and error doesnt tell user not the best error handling
  //       console.error(error);
  //     })
  //     //undisable button after quote has been rendered
  //     .finally(cFetching(false));
  // };

  const refreshSevenDayWeather = () => {

    //fetching stops overloading api
    cFetching(true);
    //get response from api usingn axios
    apiClient
      .getSevenDayWeather(location)
      // if no axios using get once reponse has been recieved pass it into function to convert to json
      //.then((res) => res.json())
      //passes it into function updateQuote .data needed when axios
      .then((res) => {
        updateSevenDayWeather(res.data);
        updateCurrentWeather(res.data.current);
        // console.log(`sevendayweather array`, res.data);
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
    // refreshCurrentWeather();
    refreshSevenDayWeather();
  }, [location]);

  const buildSevenDayWeather = () => {
    return sevenDayWeather.map((dayWeather, index) => {
      return (
        <tr key={index}>
          <td>{moment(dayWeather.dt).format("ll")}</td>
          {/* <td>{moment.unix(dayWeather.dt)}</td> */}
          {/* <td>{moment.unix(1968781876)}</td> */}
          {/* <td>{Date(dayWeather.dt)}</td> */}
          {/* {console.log(`we made it`, dayWeather.dt)} */}
          {/* {console.log(`we made it`, moment().format("ll"))} */}
          <td>{dayWeather.tag}</td>
          <td>{dayWeather.description}</td>
          <td>{dayWeather.tempmin}</td>
          <td>{dayWeather.tempmax}</td>
          <td>{dayWeather.humidity}</td>
          <td>{dayWeather.cloud}</td>
          <td>{dayWeather.windSpeed}</td>
          {/* {console.log(`we made it`, dayWeather)} */}
        </tr>
      );
    });
  };

  return (
    <div className="App">
      Hello the weather today in {cityInput.city} is <br />
      <p></p>
      <p>Date: {moment(currentWeather.dt).format("ll")}</p>
      <p>
        {currentWeather.tag} {currentWeather.description}
      </p>
      <p>Cloud Coverage: {currentWeather.cloud}%</p>
      <p>
        Temp: {currentWeather.temp} <sup>o</sup>C{" "}
      </p>
      <p>
        Feels Like: {currentWeather.feelTemp} <sup>o</sup>C{" "}
      </p>
      <p>Humidity: {currentWeather.humidity}%</p>
      <p>WindSpeed: {currentWeather.windSpeed} meter/sec</p>
      {/* <button disabled={fetching} onClick={() => refreshSevenDayWeather()}>
        Update
      </button> */}
      <form>
        <input type="text" id="cityInput" placeholder="Type City Here" />
        <button onClick={(event) => updateCity(event)}>Update City</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Main</th>
            <th>Description</th>
            <th>Temp Min</th>
            <th>Temp Max</th>
            <th>Humidity</th>
            <th>Cloud</th>
            <th>Windspeed</th>
          </tr>
        </thead>
        {/* {console.log(`array before build map`, sevenDayWeather)} */}
        <tbody>{buildSevenDayWeather()}</tbody>
      </table>
    </div>
  );
}

export default App;

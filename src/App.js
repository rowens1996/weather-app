import React, { useState, useEffect } from "react";
import * as moment from "moment";
import { ApiClient } from "./ApiClient";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Navbar from "react-bootstrap/Navbar";
import { Stack } from "react-bootstrap/";
import { Form } from "react-bootstrap/";
import { FormControl } from "react-bootstrap/";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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
    //refreshlocation(); works but bad
    refreshSevenDayWeather();
  }, [location]);

  useEffect(() => {
    //disable error for the square brackets you dont want to re-run the function after everychange in this case
    //refreshlocation(); works but bad
    refreshLocation();
  }, [cityInput]);

  const buildSevenDayWeather = () => {
    return sevenDayWeather.slice(1).map((dayWeather, index) => {
      return (
        <div key={index}>
          <Card className="dayCard" style={{ width: "23rem" }}>
            <Card.Img variant="top"  style={{ width: "10rem" }} className="icon" src={dayWeather.icon} />
            {/* <Card.Header as="h5"> */}
              <Card.Title>
                {moment(dayWeather.date * 1000).format("dddd")}
              </Card.Title>
              <Card.Subtitle className="text-muted">
                {dayWeather.tag} {dayWeather.description}
              </Card.Subtitle>
            {/* </Card.Header> */}
            <Card.Body>
              <Card.Text className="mb-1">
                Min: {dayWeather.tempmin}
                <sup>o</sup>C - Max: {dayWeather.tempmax}
                <sup>o</sup>C
              </Card.Text>
              <Card.Text className="mb-2">
                WindSpeed: {dayWeather.windSpeed}ms<sup>-1</sup>
                <br />
              </Card.Text>
              <Card.Text>
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
    <>
      <BrowserRouter>
        <Navbar
          style={{ position: "fixed", width: "100vw", zIndex: "999" }}
          className="Navbar"
          bg="light"
        >
          <Navbar.Brand className="LogoText">
            <h2>The Weather App</h2>
          </Navbar.Brand>
          <Stack direction="vertical">
            <Container fluid className="justify-content-center">
              <Form onSubmit={(event) => updateCity(event)}>
                <Stack className="mt-3 mb-3" direction="horizontal" gap="3">
                  <FormControl
                    id="cityInput"
                    type="text"
                    placeholder="City Search"
                  />
                  <Button onClick={(event) => updateCity(event)}>Search</Button>
                </Stack>
              </Form>
            </Container>
          </Stack>
        </Navbar>
      </BrowserRouter>
      <Container>
        <Card className="mainCard" style={{ width: "100%" }}>
          <Card.Img style={{ width: "10rem" }} variant="top" className="icon" src={currentWeather.icon} />
          <Card.Header as="h5" className="text-center">
            <Card.Title>The weather currently in {cityInput.city}</Card.Title>
            <Card.Subtitle className="text-secondary">
              {moment(currentWeather.date * 1000).format("ll")}
              <br />
              {currentWeather.tag} {currentWeather.description}
            </Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <Card.Text className="mb-1">
              Temp: {currentWeather.temp}
              <sup>o</sup>C - Feels Like: {currentWeather.feelTemp}
              <sup>o</sup>C
            </Card.Text>
            <Card.Text className="mb-2">
              WindSpeed: {currentWeather.windSpeed}ms<sup>-1</sup>
              <br />
            </Card.Text>
            <Card.Text className="mb-1">
              Humidity:{" "}
              <ProgressBar
                animated
                now={currentWeather.humidity}
                label={`${currentWeather.humidity}%`}
              />
            </Card.Text>
            <Card.Text className="mb-1">
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
      </Container>
      <Container>{buildSevenDayWeather()}</Container>
    </>
  );
}
{}

export default App;

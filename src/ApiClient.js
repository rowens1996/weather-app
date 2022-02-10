//axios handles api operation get set delete on the database
import axios from "axios";

export class ApiClient {

  status(response) {
    //code in this range are typically good responses
    if (response.status >= 200 && response.status < 300) {
      //say it is resovled
      return Promise.resolve(response)
    } else {
      //returns Error object as text i.e 404 Not found
      return Promise.reject(new Error(response.statusText))
    }
  }
  getLocation(cityInput) {
    //get response from api using axios this needed as we are usign objects
    return this.getRequest(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput.city},GB&appid=538a42bbc311c05496005cb6a8a564b7`
    );
  }

  getFiveDayWeather(location) {
    console.log(location.lat);
    console.log(location.lon);
    //not setting a default state before api response you could if you want
    //string interpolation to only display correct "page" ? needed for parameters 20 is default
    return this.getRequest(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&exclude=hourly,minutely&units=metric&appid=06af2c84a95e6a736fd7bab4b3be279d`
    );
  }

  // getWeather() {
  //   //get response from api using axios this needed as we are usign objects
  //   return this.getRequest(
  //     "https://api.openweathermap.org/data/2.5/onecall?lat=53.4885&lon=-1.3175&exclude=hourly,minutely&units=metric&appid=538a42bbc311c05496005cb6a8a564b7"
  //   );
  // }

  getCurrentWeather(location) {
    console.log(location.lat);
    console.log(location.lon);
    //not setting a default state before api response you could if you want
    //string interpolation to only display correct "page" ? needed for parameters 20 is default
    return this.getRequest(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=710ed526ca59cba3f2fa234c8b88bf00`
    );
  }

  getRequest(url) {
    return axios.get(url)
      .then(this.status)
      .catch(function (error) {
        // handle error
        console.error(error);
        // alert(error)
      })
  }
}

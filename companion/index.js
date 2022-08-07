import { geolocation } from "geolocation";
import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { me } from "companion";

function queryLocationWeather(){
  geolocation.getCurrentPosition(queryWeather, locationError);
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Fetch the weather from OpenWeather
function queryWeather(position) {
  let tempUnit = JSON.parse(settingsStorage.getItem("tempUnit"));
  let tempUnitStr = "f" //tempUnit['values'][0]['value'];
  let tempUnitTxt = "˚F" //tempUnit['values'][0]['name'];
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let weatherAPIQuery = `https://api.openweathermap.org/data/2.5/weather?APPID=${appkey}&lat=${lat}&lon=${lon}&units=imperial`
  fetch(weatherAPIQuery)
  .then(function (response) {
      response.json()
      .then(function(data) {
        // console.log('resp is', data);
        var weather = {
          temperature: data['main']['temp'],
          forecast: data['weather'][0]['main'],
          id: data['weather'][0]['id'],
          sunrise: data['sys']['sunrise'],
          sunset: data['sys']['sunset'],
          temp_unit: tempUnitTxt,
          location: data['name'],
          type: 'new_weather'
        }
        
        // Send the weather data to the device
        returnWeatherData(weather)
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
}

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weather") {
    // The device requested weather data
    queryLocationWeather();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}


let KEY_TEMP = "tempUnit";

// Settings have been changed
settingsStorage.onchange = function(evt) {
  sendValue(evt.key, evt.newValue);
}

// Settings were changed while the companion was not running
if (me.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(KEY_TEMP, settingsStorage.getItem(KEY_TEMP));
  queryLocationWeather();
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
      type: 'new_unit'
    });
    queryLocationWeather();
  }
}
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}

// A user changes Settings
settingsStorage.onchange = evt => {
  if (evt.key === "oauth") {
    // Settings page sent us an oAuth token
    let data = JSON.parse(evt.newValue);
    fetchFoodData(data.access_token) ;
  }
};

// Restore previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key === "oauth") {
      // We already have an oauth token
      let data = JSON.parse(settingsStorage.getItem(key))
      fetchFoodData(data.access_token);
    }
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};
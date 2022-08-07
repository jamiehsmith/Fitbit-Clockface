import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import * as utils from "../resources/utils";
import { today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery, charger } from "power";
import * as fs from "fs";
import * as messaging from "messaging";

// Update the clock every minute
clock.granularity = 'seconds';

const timeLabel = document.getElementById("timeLabel");
const secLabel = document.getElementById("secLabel");
const dateLabel = document.getElementById("dateLabel");
const caloriesLabel = document.getElementById("caloriesLabel");
const stepsLabel = document.getElementById("stepsLabel");
const distanceLabel = document.getElementById("distanceLabel");
const floorsLabel = document.getElementById("floorsLabel");

const caloriesTestLabel = document.getElementById("caloriesTestLabel");
const stepsTestLabel = document.getElementById("stepsTestLabel");
const distanceTestLabel = document.getElementById("distanceTestLabel");
const floorsTestLabel = document.getElementById("floorsTestLabel");

const azmLabel = document.getElementById("azmLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const batteryLabel = document.getElementById("batteryLabel");

let weatherForecastImg = document.getElementById("weatherForecast");
let weatherTemp = document.getElementById("weatherTemp");

let stepsThisPoint = 0;
let stepsOffset = today.adjusted.steps;
let caloriesThisPoint = 0;
let caloriesOffset = today.adjusted.calories;
let distanceThisPoint = 0;
let distanceOffset = today.adjusted.distance;
let floorsThisPoint = 0;
let floorsOffset = today.adjusted.elevationGain;

const maxLineHeight = 20;
const maxSteps = 250;
const maxDistance = 150;
const maxCalories = 100;
const maxFloors = 10;
let initialize = true;
let updatesScheduled = false;
let updatesRunning = false;
const dotCount = 96;
const interval = (Math.PI * 2) / dotCount;
const timePointInts = [0, 15, 30, 45];
let date = new Date();
let hours = date.getHours();
let mins = date.getMinutes();
let checkIfCorrectInterval;
let restoreData = {};
let restoredPoint = false;

clock.ontick = (evt) => {
  let today_dt = evt.date;
  let clockHours = today_dt.getHours();
  let clockMins = today_dt.getMinutes();
  let secs = today_dt.getSeconds();
  let day = today_dt.getDate();
  let hoursFmted;

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hoursFmted = utils.monoDigits(utils.zeroPad(clockHours % 12 || 12));
  } else {
    // 24h format
    hoursFmted = utils.monoDigits(utils.zeroPad(clockHours));
  };
  let minsFmted = utils.monoDigits(utils.zeroPad(clockMins));
  let secsFmted = utils.monoDigits(utils.zeroPad(secs));
  
  timeLabel.text = `${hoursFmted}:${minsFmted}`;  
  secLabel.text = secsFmted;
  
  let month = utils.formattedMonth()[today_dt.getMonth()];
  let weekday = utils.formattedDays()[today_dt.getDay()];
  // dayLabel.text = `${weekday}`;
  dateLabel.text = `${weekday} ${month} ${day}`;

  // Add calories label
  let calories = (today.adjusted.calories || 0).toLocaleString();
  caloriesLabel.text = calories;

   // Add steps label
  let steps = (today.adjusted.steps || 0).toLocaleString();
  stepsLabel.text = steps;

  // Add distance label
  let distance = (today.adjusted.distance || 0) * 0.000621371192; // convert meters to miles
  distanceLabel.text = distance === 0 ? 0 : distance.toFixed(2);
  
  // Add floors label
  let floors = (today.adjusted.elevationGain || 0);
  floorsLabel.text = floors;
  
  // Add active zone minutes label
  let activeZoneMinutes = (today.adjusted.activeZoneMinutes || 0);
  azmLabel.text = activeZoneMinutes.total;

  // Battery label
  let batteryLevel = Math.floor(battery.chargeLevel);
  let batterLevelFmted = '';
  if (batteryLevel > 0) {
      batterLevelFmted = `${utils.monoDigits(batteryLevel, false)}%`;
  }
  batteryLabel.text = batterLevelFmted;
  
  // For testing - update every second
  // updateActivityLine();
}

if (initialize) {
  initialize = false;
  restoreData = fs.readFileSync("restorePoints.txt", "json");
  const currentPoint = getCurrentPoint()['point'];
  
  if (restoreData && Object.keys(restoreData) && Object.keys(restoreData).length) {
    restorePointsToDevice();
    if (!restoreData.hasOwnProperty(`caloriesPoint${currentPoint}`)) {
      updateActivityLine();
    } else {
      restoredPoint = true;
    }
  } else {
    updateActivityLine();
  }
  checkPreviousLines();
}

if (!updatesScheduled) {
  checkIfCorrectInterval = setInterval(function() {
    // Every minute
    date = new Date();
    hours = date.getHours();
    mins = date.getMinutes();

    // Hack to wake system for step count
    display.poke();
    display.on = false;
    
    if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
      // Start automated line drawing we're on a 15 minute interval
      updatesScheduled = true;
      updateActivityLines();
      drawActivityLines();
    }
  }, 60000);
}

// For testing - adds all points
// for (let i = 1; i <= 96; i++) {
//   let height = 20;
//   // let height = Math.floor(Math.random() * 20);
//   setPoint(i, height, "step");
//   // height = Math.floor(Math.random() * 20);
//   setPoint(i, height, "calories");
// }

function setPoint(point, height, type) {
  let pointElement = document.getElementById(`${type}Point${point}`);

  var t = interval * point;
  var r = 110;
  var x = 148 + r * Math.cos(t)
  var y = 154 + r * Math.sin(t)
  
  if (type === "time") {
    // Minimum height of 1 so bar is visible
    height = 1.15;
  }
  
  let x2 = x + height * Math.cos(t);
  let y2 = y + height * Math.sin(t);
  
  pointElement.x1 = x;
  pointElement.y1 = y;
  pointElement.x2 = x2;
  pointElement.y2 = y2;
  // pointElement.style.opacity = Math.max((height / maxLineHeight), .3);
  
  if (type != "time") {
    let restoreData = {
      'x1': x,
      'y1': y,
      'x2': x2,
      'y2': y2,
      'height': height,
    }
    
    storePointToDevice(`${type}Point${point}`, restoreData);
  }
}

function storePointToDevice(element, points) {
  // Store points to device, so if the clockface is closed we can redraw
  restoreData[element] = points;
  fs.writeFileSync("restorePoints.txt", restoreData, "json");
}

function restorePointsToDevice() {
  for (const line in restoreData) {
    let pointElement = document.getElementById(`${line}`);

    pointElement.x1 = restoreData[line].x1;
    pointElement.y1 = restoreData[line].y1;
    pointElement.x2 = restoreData[line].x2;
    pointElement.y2 = restoreData[line].y2;
  }
}

function resetPoints() {
  let coordinates = ['x1', 'y1', 'x2', 'y2'];
  let timePointElement;
  let stepPointElement;
  let caloriesPointElement;
  let distancePointElement;
  let floorsPointElement;

  const pointElements = [timePointElement, stepPointElement,
    caloriesPointElement, distancePointElement, floorsPointElement];
  for (let i = 1; i <= dotCount; i++) {
    timePointElement = document.getElementById(`timePoint${i}`);
    stepPointElement = document.getElementById(`stepPoint${i}`);
    caloriesPointElement = document.getElementById(`caloriesPoint${i}`);
    distancePointElement = document.getElementById(`distancePoint${i}`);
    floorsPointElement = document.getElementById(`floorsPoint${i}`);

    for (let p = 0; p < pointElements.length; p++) {
      for (let c = 0; c < coordinates.length; c++) {
        pointElements[p][c] = 149;
      }
      // pointElements[p]['style']['opacity'] = 1;
    }
  }

  for (var i = 0; i <= 23; i++) {
    for (var j = 0; j < timePointInts.length; j++) {
      utils.timePoints[i][j]['visible'] = false;
    }
  }
  
  restoreData = {};
  fs.writeFileSync("restorePoints.txt", restoreData, "json");
}

function getCurrentPoint() {
  if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
    return utils.timePoints[hours][mins];
  }

  let timePos = 0;
  if (mins >= 15 && mins < 30) {
    timePos = 15;
  } else if (mins >= 30 && mins < 45) {
    timePos = 30;
  } else if (mins >= 45) {
    timePos = 45;
  }
  
  return utils.timePoints[hours][timePos];
}

function calculateLineHeight(total, type) {
  let lineHeight = 0;
  let max = maxSteps;
  if (type === "calories") {
    max = maxCalories;
  } else if (type === "distance") {
    max = maxDistance;
  } else if (type === "floors") {
    max = maxFloors;
  }

  if (total > 0 && total < max) {
    // Calculate steps to max step ratio
    lineHeight = ((total / max) * 10) * 2;
  } else if (total > max) {
    // Steps are greater than max steps, set to max height
    lineHeight = maxLineHeight;
  }
  
  return lineHeight;
}

function addActivityLine(point = null) {
  if (!point) {
    point = getCurrentPoint();
  }
  setPoint(point['point'], 0, "time");

  point['visible'] = true;
}

function updateActivityLine() {
  const currentLine = getCurrentPoint();
  const currentPoint = currentLine['point'];
  let lineHeight;

  // Calculate calories since previous point
  caloriesThisPoint = today.adjusted.calories - caloriesOffset || 0;
  // caloriesTestLabel.text = `${caloriesThisPoint} / ${maxCalories}`;
  lineHeight = calculateLineHeight(caloriesThisPoint, "calories");
  if (!restoredPoint || (restoreData.hasOwnProperty(`caloriesPoint${currentPoint}`) && restoreData[`caloriesPoint${currentPoint}`]['height'] < lineHeight) || !restoreData.hasOwnProperty(`caloriesPoint${currentPoint}`)) {
    setPoint(currentPoint, lineHeight, "calories");
  }
  
  // Calculate steps since previous point
  stepsThisPoint = today.adjusted.steps - stepsOffset || 0;
  // stepsTestLabel.text = `${stepsThisPoint} / ${maxSteps}`;
  lineHeight = calculateLineHeight(stepsThisPoint, "step");
  if (!restoredPoint || (restoreData.hasOwnProperty(`stepPoint${currentPoint}`) && restoreData[`stepPoint${currentPoint}`]['height'] < lineHeight) || !restoreData.hasOwnProperty(`stepPoint${currentPoint}`)) {
    setPoint(currentPoint, lineHeight, "step");
  }
  
  // Calculate distance since previous point
  distanceThisPoint = today.adjusted.distance - distanceOffset || 0;
  // distanceTestLabel.text = `${distanceThisPoint} / ${maxDistance}`;
  lineHeight = calculateLineHeight(distanceThisPoint, "distance");
  if (!restoredPoint || (restoreData.hasOwnProperty(`distancePoint${currentPoint}`) && restoreData[`distancePoint${currentPoint}`]['height'] < lineHeight) || !restoreData.hasOwnProperty(`distancePoint${currentPoint}`)) {
    setPoint(currentPoint, lineHeight, "distance");
  }
  
  // Calculate floors since previous point
  floorsThisPoint = today.adjusted.elevationGain - floorsOffset || 0;
  // floorsTestLabel.text = `${floorsThisPoint} / ${maxFloors}`;
  lineHeight = calculateLineHeight(floorsThisPoint, "floors");
  if (!restoredPoint || (restoreData.hasOwnProperty(`floorsPoint${currentPoint}`) && restoreData[`floorsPoint${currentPoint}`]['height'] < lineHeight) || !restoreData.hasOwnProperty(`floorsPoint${currentPoint}`)) {
    setPoint(currentPoint, lineHeight, "floors");
  }

  currentLine['visible'] = true;
}

async function setPreviousActivityLine(total, type) {
  const currentLine = getCurrentPoint();
  const currentPoint = currentLine['point'];
  let lineHeight;
  
  if (currentPoint > 1 && currentPoint <= 96) {
    currentPoint--;
  } else if (currentPoint === 1) {
    currentPoint = 96;
  }

  if (type === "calories") {
    caloriesThisPoint = today.adjusted.calories - total || 0;
    lineHeight = calculateLineHeight(caloriesThisPoint, "calories");
    setPoint(currentPoint, lineHeight, "calories");
  } else if (type === "step") {
    stepsThisPoint = today.adjusted.steps - total || 0;
    lineHeight = calculateLineHeight(stepsThisPoint, "step");
    setPoint(currentPoint, lineHeight, "step");
  } else if (type === "distance") {
    distanceThisPoint = today.adjusted.distance - total || 0;
    lineHeight = calculateLineHeight(distanceThisPoint, "distance");
    setPoint(currentPoint, lineHeight, "distance");
  } else if (type === "floors") {
    floorsThisPoint = today.adjusted.elevationGain - total || 0;
    lineHeight = calculateLineHeight(floorsThisPoint, "floors");
    setPoint(currentPoint, lineHeight, "floors");
  }

  currentLine['visible'] = true;
  
  return;
}

function checkPreviousLines() {
  // Check mins from this hour for missing lines

  // If current time is < :15, no need to check previous minutes
  if (mins > 15) {
    // Check :00 line
    if (mins > 15) {
      if (!utils.timePoints[hours][0]['visible']) {
        addActivityLine(utils.timePoints[hours][0]);
      }
    }

    // Check :15 line
    if (mins >= 30) {
      if (!utils.timePoints[hours][15]['visible']) {
        addActivityLine(utils.timePoints[hours][15]);
      }
    }

   // Check :30 line
    if (mins >= 45) {
      if (!utils.timePoints[hours][30]['visible']) {
        addActivityLine(utils.timePoints[hours][30]);
      }
    }
  }

  if (hours > 0) {
    // Loop through previous hours
    for (var i = hours - 1; i >= 0; i--) {
      for (var j = 0; j < timePointInts.length; j++) {
        let minutes = timePointInts[j];
        if (!utils.timePoints[i][minutes]['visible']) {
          // Point is not visible, add it
          addActivityLine(utils.timePoints[i][minutes]);
        }
      }
    }
  }
}

async function updateActivityLines() {
  updatesRunning = true;
  date = new Date();
  hours = date.getHours();
  mins = date.getMinutes();
  if (restoredPoint) {
    restoredPoint = false;
  }
  if (hours === 0 && mins === 0) {
    // Current point is midnight, reset points
    resetPoints();
  } else {
    // Set final count for previous line
    await setPreviousActivityLine(caloriesOffset, "calorie");
    await setPreviousActivityLine(stepsOffset, "step");
    await setPreviousActivityLine(distanceOffset, "distance");
    await setPreviousActivityLine(floorsOffset, "floors");

    // checkPreviousLines();
  }

  // Reset steps
  stepsThisPoint = 0;
  stepsOffset = today.adjusted.steps;

  // Reset calories
  caloriesThisPoint = 0;
  caloriesOffset = today.adjusted.calories;

  // Reset distance
  distanceThisPoint = 0;
  distanceOffset = today.adjusted.distance;

  // Reset floors
  floorsThisPoint = 0;
  floorsOffset = today.adjusted.elevationGain;

  addActivityLine();
  updatesRunning = false;
}

function drawActivityLines() {
  clearInterval(checkIfCorrectInterval);
  setInterval(function() {
    // Every 15 mins

    // Hack to wake system for step count
    display.poke();
    display.on = false;

    updateActivityLines();
  }, 900000);
}

display.onchange = function() {
  date = new Date();
  hours = date.getHours();
  mins = date.getMinutes();
  
  const updateTime = mins === 0 || mins === 15 || mins === 30 || mins === 45;
  if (display.on && !updatesRunning && !updateTime) {
    // Screen is on - update current activity line
    updateActivityLine();
  }
}

// Heart rate and body sensors
const hrm = new HeartRateSensor();
const body = new BodyPresenceSensor();

hrm.onreading = function() {
    let hr = hrm.heartRate || 0;
    let hrFmted;
    if (hr === 0) {
        hrFmted = "---";
    } else {
        hrFmted = utils.monoDigits(hr, false);
    }
    heartRateLabel.text = hrFmted;
}
hrm.onerror = function() {
    heartRateLabel.text = "---";
}

body.onreading = () => {
    if (!body.present) {
        heartRateLabel.text = "---";
        hrm.stop();
    } else {
        hrm.start();
    }
};
body.start();

function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

function processWeatherData(data) {
  console.log('data is', JSON.stringify(data));
  // weatherForecast.text = data.forecast;
  let displayTemp = Math.round(data.temperature);
  weatherTemp.text = `${displayTemp} ${data.temp_unit}`;
  
  const nowHours = new Date().getHours();
  const isDaytime = nowHours > 6 && nowHours < 18;
  console.log('is day?', isDaytime);
  weatherForecastImg.href = utils.getWeatherIcon(data.id, isDaytime);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchWeather();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
      if (evt.data['type'] == 'new_weather'){
        processWeatherData(evt.data);
      } else if (evt.data['type'] == 'new_unit') {
        let tempUnitLabel = document.getElementById("tempUnitLabel");
        tempUnitLabel.text = `${evt.data['value']['values'][0]['name']}`;
      } else if (evt.data['type'] == 'calories') {
        processCalories(evt.data);
      }
   }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Fetch the weather every 30 minutes
setInterval(fetchWeather, 30 * 1000 * 60);
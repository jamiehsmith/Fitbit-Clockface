import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import * as utils from "../resources/utils";
import { today } from "user-activity"
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery, charger } from "power";

// Update the clock every minute
clock.granularity = 'seconds';

const timeLabel = document.getElementById("timeLabel");
const secLabel = document.getElementById("secLabel");
const dateLabel = document.getElementById("dateLabel");
const dayLabel = document.getElementById("dayLabel");
const caloriesLabel = document.getElementById("caloriesLabel");
const stepsLabel = document.getElementById("stepsLabel");
const heartRateLabel = document.getElementById("heartRateLabel");
const batteryLabel = document.getElementById("batteryLabel");

let stepsThisPoint = 0;
let stepsOffset = today.adjusted.steps;
let caloriesThisPoint = 0;
let caloriesOffset = today.adjusted.calories;

let initialPoint = true;
let maxLineHeight = 20;
let maxSteps = 100;
let maxCalories = 50;
// let hours;
// let mins;
let initialize = true;
let updatesRunning = false;
const dotCount = 96;
const interval = (Math.PI * 2) / dotCount;
const timePointInts = [0, 15, 30, 45];
let date = new Date();
let hours = date.getHours();
let mins = date.getMinutes();
let checkIfCorrectInterval;

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
  dayLabel.text = `${weekday}`;
  dateLabel.text = `${month} ${day}`;

  // Add calories label
  let calories = (today.adjusted.calories || 0).toLocaleString();
  caloriesLabel.text = calories;

   // Add steps label
  let steps = (today.adjusted.steps || 0).toLocaleString();
  stepsLabel.text = steps;

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
  updateActivityLine();
  checkPreviousLines();
}

if (!updatesRunning) {
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
      updatesRunning = true;
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
  var r = 100;
  var x = 148 + r * Math.cos(t)
  var y = 148 + r * Math.sin(t)
  
  if (height < 2) {
    // Minimum height of 2 so bar is visible
    height = 2;
  }
  
  pointElement.x1 = x;
  pointElement.y1 = y;
  pointElement.x2 = x + height * Math.cos(t);
  pointElement.y2 = y + height * Math.sin(t);
  pointElement.style.opacity = Math.max((height / maxLineHeight), .3);
}

function resetPoints() {
  for (var i = 1; i <= dotCount; i++) {
    let stepPointElement = document.getElementById(`stepPoint${i}`);
    
    stepPointElement.x1 = 149;
    stepPointElement.y1 = 149;
    stepPointElement.x2 = 149;
    stepPointElement.y2 = 149;
    stepPointElement.opacity = 1;

    let caloriesPointElement = document.getElementById(`caloriesPoint${i}`);
    
    caloriesPointElement.x1 = 149;
    caloriesPointElement.y1 = 149;
    caloriesPointElement.x2 = 149;
    caloriesPointElement.y2 = 149;
    caloriesPointElement.opacity = 1;
  }

  for (var i = 0; i <= 23; i++) {
    for (var j = 0; j < timePointInts.length; j++) {
      utils.timePoints[i][j]['visible'] = false;
    }
  }
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
  if (type === "step") {
    if (total > 0 && total < maxSteps) {
      // Calculate steps to max step ratio
      lineHeight = ((total / maxSteps) * 10) * 2;
    } else if (total > maxSteps) {
      // Steps are greater than max steps, set to max height
      lineHeight = maxLineHeight;
    }
  } else if (type === "calories") {
    if (total > 0 && total < maxCalories) {
      // Calculate steps to max step ratio
      lineHeight = ((total / maxCalories) * 10) * 2;
    } else if (total > maxCalories) {
      // Steps are greater than max steps, set to max height
      lineHeight = maxLineHeight;
    }
  }
  
  return lineHeight;
}

function addActivityLine(point = null) {
  if (!point) {
    point = getCurrentPoint();
  }
  setPoint(point['point'], 0, "calories");
  setPoint(point['point'], 0, "step");

  point['visible'] = true;
}

function updateActivityLine() {
  const currentLine = getCurrentPoint();
  const currentPoint = currentLine['point'];
  let lineHeight;

  // Calculate calories since the hour
  caloriesThisPoint = today.adjusted.calories - caloriesOffset || 0;
  lineHeight = calculateLineHeight(caloriesThisPoint, "calories");
  setPoint(currentPoint, lineHeight, "calories");
  
  // Calculate steps since the hour
  stepsThisPoint = today.adjusted.steps - stepsOffset || 0;
  lineHeight = calculateLineHeight(stepsThisPoint, "step");
  setPoint(currentPoint, lineHeight, "step");

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
  date = new Date();
  hours = date.getHours();
  mins = date.getMinutes();
  if (hours === 0 && mins === 0) {
    // Current point is midnight, reset points
    resetPoints();
  } else {
    // Set final count for previous line
    await setPreviousActivityLine(caloriesOffset, "calorie");
    await setPreviousActivityLine(stepsOffset, "step");

    checkPreviousLines();
  }

  // Reset steps
  stepsThisPoint = 0;
  stepsOffset = today.adjusted.steps;

  // Reset calories
  caloriesThisPoint = 0;
  caloriesOffset = today.adjusted.calories;

  addActivityLine();
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
  if (display.on && mins !== 0 && mins !== 15 && mins !== 30 && mins !== 45) {
    // Screen is on - update activity line
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
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
let secLabel = document.getElementById("secLabel");
let dateLabel = document.getElementById("dateLabel");
let dayLabel = document.getElementById("dayLabel");
let caloriesLabel = document.getElementById("caloriesLabel");
let stepsLabel = document.getElementById("stepsLabel");
let heartRateLabel = document.getElementById("heartRateLabel");
let batteryLabel = document.getElementById("batteryLabel");

let stepsThisPoint = 0;
let stepsOffset = today.adjusted.steps;
let caloriesThisPoint = 0;
let caloriesOffset = today.adjusted.calories;

let initialPoint = true;
let maxLineHeight = 20;
let maxSteps = 100;
let maxCalories = 50;
let hours;
let mins;
let initialize = true;
let updatesRunning = false;
const dotCount = 96;
const interval = (Math.PI * 2) / dotCount;
const timePointInts = [0, 15, 30, 45];
let timePoints = {
    0: { 0: { point: 72, visible: false }, 15: { point: 73, visible: false }, 30: { point: 74, visible: false }, 45: { point: 75, visible: false } },
    1: { 0: { point: 76, visible: false }, 15: { point: 77, visible: false }, 30: { point: 78, visible: false }, 45: { point: 79, visible: false } },
    2: { 0: { point: 80, visible: false }, 15: { point: 81, visible: false }, 30: { point: 82, visible: false }, 45: { point: 83, visible: false } },
    3: { 0: { point: 84, visible: false }, 15: { point: 85, visible: false }, 30: { point: 86, visible: false }, 45: { point: 87, visible: false } },
    4: { 0: { point: 88, visible: false }, 15: { point: 89, visible: false }, 30: { point: 90, visible: false }, 45: { point: 91, visible: false } },
    5: { 0: { point: 92, visible: false }, 15: { point: 93, visible: false }, 30: { point: 94, visible: false }, 45: { point: 95, visible: false } },
    6: { 0: { point: 96, visible: false }, 15: { point: 1, visible: false }, 30: { point: 2, visible: false }, 45: { point: 3, visible: false } },
    7: { 0: { point: 4, visible: false }, 15: { point: 5, visible: false }, 30: { point: 6, visible: false }, 45: { point: 7, visible: false } },
    8: { 0: { point: 8, visible: false }, 15: { point: 9, visible: false }, 30: { point: 10, visible: false }, 45: { point: 11, visible: false } },
    9: { 0: { point: 12, visible: false }, 15: { point: 13, visible: false }, 30: { point: 14, visible: false }, 45: { point: 15, visible: false } },
    10: { 0: { point: 16, visible: false }, 15: { point: 17, visible: false }, 30: { point: 18, visible: false }, 45: { point: 19, visible: false } },
    11: { 0: { point: 20, visible: false }, 15: { point: 21, visible: false }, 30: { point: 22, visible: false }, 45: { point: 23, visible: false } },
    12: { 0: { point: 24, visible: false }, 15: { point: 25, visible: false }, 30: { point: 26, visible: false }, 45: { point: 27, visible: false } },
    13: { 0: { point: 28, visible: false }, 15: { point: 29, visible: false }, 30: { point: 30, visible: false }, 45: { point: 31, visible: false } },
    14: { 0: { point: 32, visible: false }, 15: { point: 33, visible: false }, 30: { point: 34, visible: false }, 45: { point: 35, visible: false } },
    15: { 0: { point: 36, visible: false }, 15: { point: 37, visible: false }, 30: { point: 38, visible: false }, 45: { point: 39, visible: false } },
    16: { 0: { point: 40, visible: false }, 15: { point: 41, visible: false }, 30: { point: 42, visible: false }, 45: { point: 43, visible: false } },
    17: { 0: { point: 44, visible: false }, 15: { point: 45, visible: false }, 30: { point: 46, visible: false }, 45: { point: 47, visible: false } },
    18: { 0: { point: 48, visible: false }, 15: { point: 49, visible: false }, 30: { point: 50, visible: false }, 45: { point: 51, visible: false } },
    19: { 0: { point: 52, visible: false }, 15: { point: 53, visible: false }, 30: { point: 54, visible: false }, 45: { point: 55, visible: false } },
    20: { 0: { point: 56, visible: false }, 15: { point: 57, visible: false }, 30: { point: 58, visible: false }, 45: { point: 59, visible: false } },
    21: { 0: { point: 60, visible: false }, 15: { point: 61, visible: false }, 30: { point: 62, visible: false }, 45: { point: 63, visible: false } },
    22: { 0: { point: 64, visible: false }, 15: { point: 65, visible: false }, 30: { point: 66, visible: false }, 45: { point: 67, visible: false } },
    23: { 0: { point: 68, visible: false }, 15: { point: 69, visible: false }, 30: { point: 70, visible: false }, 45: { point: 71, visible: false } },
}

clock.ontick = (evt) => {
  let today_dt = evt.date;
  hours = today_dt.getHours();
  mins = today_dt.getMinutes();
  let secs = today_dt.getSeconds();
  let day = today_dt.getDate();
  let hoursFmted;

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hoursFmted = utils.monoDigits(utils.zeroPad(hours % 12 || 12));
  } else {
    // 24h format
    hoursFmted = utils.monoDigits(utils.zeroPad(hours));
  };
  let minsFmted = utils.monoDigits(utils.zeroPad(mins));
  let secsFmted = utils.monoDigits(utils.zeroPad(secs));
  
  timeLabel.text = `${hoursFmted}:${minsFmted}`;  
  secLabel.text = secsFmted;
  
  let month = utils.formattedMonth()[today_dt.getMonth()];
  let weekday = utils.formattedDays()[today_dt.getDay()];
  dayLabel.text = `${weekday}`;
  dateLabel.text = `${month} ${day}`;

  if (initialize) {
    initialize = false;
    updateActivityLine();
    checkPreviousLines();
  }
  
  if (!updatesRunning) {
    // Hack to wake system
    if (display.off) {
      display.poke();
      display.on = false;
    }

    if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
      // Start automated line drawing we're on a 15 minute interval
      updatesRunning = true;
      updateActivityLines();
      drawActivityLines();
    }
  }
  
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

// For testing - adding all points
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
      timePoints[i][j]['visible'] = false;
    }
  }
}

function getCurrentPoint() {
  if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
    return timePoints[hours][mins];
  }

  let timePos = 0;
  if (mins >= 15 && mins < 30) {
    timePos = 15;
  } else if (mins >= 30 && mins < 45) {
    timePos = 30;
  } else if (mins >= 45) {
    timePos = 45;
  }
  
  return timePoints[hours][timePos];
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
  
  console.log(`returning lineHeight ${lineHeight} for ${type}`)
  return lineHeight;
}

function addActivityLine(point = null) {
  console.log('addActivityLine running');
  if (!point) {
    point = getCurrentPoint();
  }
  console.log(`currentPoint: ${point['point']}`);
  setPoint(point['point'], 0, "calories");
  setPoint(point['point'], 0, "step");

  point['visible'] = true;
}

function updateActivityLine() {
  console.log('updateActivityLine running');
  const currentLine = getCurrentPoint();
  const currentPoint = currentLine['point'];
  console.log(`currentPoint: ${currentPoint}`);
  let lineHeight;

  // Calculate calories since the hour
  caloriesThisPoint = today.adjusted.calories - caloriesOffset || 0;
  lineHeight = calculateLineHeight(caloriesThisPoint, "calories");
  console.log(`setting point: ${currentPoint}, ${lineHeight}, calories`);
  setPoint(currentPoint, lineHeight, "calories");
  
  // Calculate steps since the hour
  stepsThisPoint = today.adjusted.steps - stepsOffset || 0;
  lineHeight = calculateLineHeight(stepsThisPoint, "step");
  console.log(`setting point: ${currentPoint}, ${lineHeight}, step`);
  setPoint(currentPoint, lineHeight, "step");

  currentLine['visible'] = true;
}

async function setPreviousActivityLine(total, type) {
  console.log(`setPreviousActivityLine running with: ${total}, ${type}`)
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
    console.log(`forpreviousline, setting: point: ${currentPoint}, ${lineHeight}, calories`)
    setPoint(currentPoint, lineHeight, "calories");
  } else if (type === "step") {
    stepsThisPoint = today.adjusted.steps - total || 0;
    lineHeight = calculateLineHeight(stepsThisPoint, "step");
    console.log(`forpreviousline, setting: point: ${currentPoint}, ${lineHeight}, step`)
    setPoint(currentPoint, lineHeight, "step");
  }

  currentLine['visible'] = true;
  
  return;
}

function checkPreviousLines() {
  console.log('checkPreviousLines running');
  // Check mins from this hour for missing lines

  // If current time is < :15, no need to check previous minutes
  if (mins > 15) {
    // Check :00 line
    if (mins > 15) {
      if (!timePoints[hours][0]['visible']) {
        addActivityLine(timePoints[hours][0]);
      }
    }

    // Check :15 line
    if (mins >= 30) {
      if (!timePoints[hours][15]['visible']) {
        addActivityLine(timePoints[hours][15]);
      }
    }

   // Check :30 line
    if (mins >= 45) {
      if (!timePoints[hours][30]['visible']) {
        addActivityLine(timePoints[hours][30]);
      }
    }
  }

  if (hours > 0) {
    // Loop through previous hours
    for (var i = hours - 1; i >= 0; i--) {
      for (var j = 0; j < timePointInts.length; j++) {
        let minutes = timePointInts[j];
        if (!timePoints[i][minutes]['visible']) {
          // Point is not visible, add it
          addActivityLine(timePoints[i][minutes]);
        }
      }
    }
  }
}

async function updateActivityLines() {
  if (hours === 0 && mins === 0) {
    // Current point is midnight, reset points
    resetPoints();
  } else {
    console.log('not midnight, setting previous counts!');
    // Set final count for previous line
    await setPreviousActivityLine(caloriesOffset, "calorie");
    await setPreviousActivityLine(stepsOffset, "step");

    checkPreviousLines();
  }

  console.log('resetting steps');
  // Reset steps
  stepsThisPoint = 0;
  stepsOffset = today.adjusted.steps;

  console.log('resetting calories');
  // Reset calories
  caloriesThisPoint = 0;
  caloriesOffset = today.adjusted.calories;

  addActivityLine();
}

function drawActivityLines() {
  setInterval(function() {
    console.log('setInterval running');
    // Every 15 mins

    // Hack to wake system for step count
    display.poke();
    display.on = false;

    updateActivityLines();
  }, 900000);
}

display.onchange = function() {
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
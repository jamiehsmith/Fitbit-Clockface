import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../resources/utils";
import { today } from "user-activity"
import { display } from "display";

// Update the clock every minute
clock.granularity = 'seconds';

const timeLabel = document.getElementById("timeLabel");
let dateLabel = document.getElementById("dateLabel");
let secLabel = document.getElementById("secLabel");
let hoursFmted;

let stepsThisPoint = 0;
let stepsOffset = today.adjusted.steps;
let caloriesThisPoint = 0;
let caloriesOffset = today.adjusted.calories;
let currentPoint;
let newPoint;

let testPoint = true;
let lineHeight;
let initialPoint = true;
let maxLineHeight = 20;
let hours;
let mins;
let initialize = true;
let updatesRunning = false;
const dotCount = 96; 
const interval = (Math.PI * 2) / dotCount;

clock.ontick = (evt) => {
  let today_dt = evt.date;
  hours = today_dt.getHours();
  mins = today_dt.getMinutes();
  let secs = today_dt.getSeconds();
  let day = today_dt.getDate();

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hoursFmted = util.monoDigits(util.zeroPad(hours % 12 || 12));
  } else {
    // 24h format
    hoursFmted = util.monoDigits(util.zeroPad(hours));
  };
  let minsFmted = util.monoDigits(util.zeroPad(mins));
  let secsFmted = util.monoDigits(util.zeroPad(secs));
  
  timeLabel.text = `${hoursFmted}:${minsFmted}`;  
  secLabel.text = secsFmted;
  
  let month = util.formattedMonth()[today_dt.getMonth()];
  let weekday = util.formattedDays()[today_dt.getDay()];
  
  if (initialize) {
    initialize = false;
    addActivityLine();
  }
  
  if (!updatesRunning) {
    // Hack to wake system
    if (display.off) {
      display.poke();
      display.on = false;
    }

    if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
      console.log('CALLING DRAW ACTIVIES');
      // Start automated line drawing we're on a 15 minute interval
      updatesRunning = true;
      drawActivityLines();
    }
  }
  
  // addActivityLine()
  
  // dateLabel.text = `${weekday}, ${month} ${day}`;
}

// For testing!
// for (let i = 1; i <= 96; i++) {
//   // let height = 20;
//   let height = Math.floor(Math.random() * 20);
//   setPoint(i, height);
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
  pointElement.style.opacity = height / maxLineHeight;

}

function resetPoints(type) {
  for (var i = 1; i <= dotCount; i++) {
    let pointElement = document.getElementById(`${type}Point${i}`);
    
    pointElement.x1 = 149;
    pointElement.y1 = 149;
    pointElement.x2 = 149;
    pointElement.y2 = 149;
    pointElement.opacity = 1;
  }
}

function getCurrentPoint() {
  if (mins === 0 || mins === 15 || mins === 30 || mins === 45) {
    return util.timeToPoint()[hours][mins];
  }

  let timePos = 0;
  if (mins >= 15 && mins < 30) {
    timePos = 15;
  } else if (mins >= 30 && mins < 45) {
    timePos = 30;
  } else if (mins >= 45) {
    timePos = 45;
  }
  
  return util.timeToPoint()[hours][timePos];
}

function calculateLineHeight(total, type) {
  let maxSteps = 500;
  let maxCalories = 150;
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

function addActivityLine() {
  currentPoint = getCurrentPoint();

  // Calculate calories since the hour
  caloriesThisPoint = today.adjusted.calories - caloriesOffset || 0;
  lineHeight = calculateLineHeight(stepsThisPoint, "calories");
  console.log(`caloriesThisPoint ${caloriesThisPoint}`);
  console.log(`calories today total ${today.adjusted.calories}`);
  setPoint(currentPoint, lineHeight, "calories");
  
  // Calculate steps since the hour
  stepsThisPoint = today.adjusted.steps - stepsOffset || 0;
  lineHeight = calculateLineHeight(stepsThisPoint, "step");
  console.log(`stepsThisPoint ${stepsThisPoint}`);
  console.log(`steps today total ${today.adjusted.steps}`);
  setPoint(currentPoint, lineHeight, "step");
}

function setPreviousActivityLine(total, type) {
  currentPoint = getCurrentPoint();
  
  if (currentPoint > 1 && currentPoint <= 96) {
    currentPoint--;
  } else if (currentPoint === 1) {
    currentPoint = 96;
  }
  
  if (type === "step") {
   stepsThisPoint = today.adjusted.steps - total || 0;
   console.log(`setpreviousactivityline setting point ${currentPoint} with ${stepsThisPoint}`);

   lineHeight = calculateLineHeight(stepsThisPoint, "step");

   setPoint(currentPoint, lineHeight, "step");
  } else if (type === "calories") {
   caloriesThisPoint = today.adjusted.calories - total || 0;
   console.log(`setpreviousactivityline setting point ${currentPoint} with ${stepsThisPoint}`);

   lineHeight = calculateLineHeight(caloriesThisPoint, "calories");

   setPoint(currentPoint, lineHeight, "calories");
  }
}

function drawActivityLines() {
  console.log('drawactivitylines called')
  setInterval(function() {
    console.log('set interval running');
    // Every 15 mins

    // Hack to wake system for step count
    display.poke();
    display.on = false;

    if (hours === 0 && mins === 0) {
      // Current point is midnight, reset points
      resetPoints("calories");
      resetPoints("step");
    } else {
      // Set final count for previous line
      setPreviousActivityLine(caloriesOffset, "calorie");
      setPreviousActivityLine(stepsOffset, "step");
    }
    addActivityLine();
    
    // Reset steps
    stepsThisPoint = 0;
    stepsOffset = today.adjusted.steps;
    
    // Reset calories
    caloriesThisPoint = 0;
    caloriesOffset = today.adjusted.calories;
  }, 900000);
}

display.onchange = function() {
  if (display.on) {
    // Screen is on - update activity line
    addActivityLine();
  }
}

// for (var i = 1; i <= 96; i++) {
//   let height = 10;
//   if (i % 2 === 0) {
//     height = 20;
//   }
//   setPoint(i, height);
// }

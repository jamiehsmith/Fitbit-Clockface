// import { Accelerometer } from "accelerometer";
// import { Barometer } from "barometer";
// import { BodyPresenceSensor } from "body-presence";
// import { display } from "display";
// import document from "document";
// import { Gyroscope } from "gyroscope";
// import { HeartRateSensor } from "heart-rate";
// import { OrientationSensor } from "orientation";

// const accelLabel = document.getElementById("accel-label");
// const accelData = document.getElementById("accel-data");

// const barLabel = document.getElementById("bar-label");
// const barData = document.getElementById("bar-data");

// const bpsLabel = document.getElementById("bps-label");
// const bpsData = document.getElementById("bps-data");

// const gyroLabel = document.getElementById("gyro-label");
// const gyroData = document.getElementById("gyro-data");

// const hrmLabel = document.getElementById("hrm-label");
// const hrmData = document.getElementById("hrm-data");

// const orientationLabel = document.getElementById("orientation-label");
// const orientationData = document.getElementById("orientation-data");

// const sensors = [];

// if (Accelerometer) {
//   const accel = new Accelerometer({ frequency: 1 });
//   accel.addEventListener("reading", () => {
//     accelData.text = JSON.stringify({
//       x: accel.x ? accel.x.toFixed(1) : 0,
//       y: accel.y ? accel.y.toFixed(1) : 0,
//       z: accel.z ? accel.z.toFixed(1) : 0
//     });
//   });
//   sensors.push(accel);
//   accel.start();
// } else {
//   accelLabel.style.display = "none";
//   accelData.style.display = "none";
// }

// if (Barometer) {
//   const barometer = new Barometer({ frequency: 1 });
//   barometer.addEventListener("reading", () => {
//     barData.text = JSON.stringify({
//       pressure: barometer.pressure ? parseInt(barometer.pressure) : 0
//     });
//   });
//   sensors.push(barometer);
//   barometer.start();
// } else {
//   barLabel.style.display = "none";
//   barData.style.display = "none";
// }

// if (BodyPresenceSensor) {
//   const bps = new BodyPresenceSensor();
//   bps.addEventListener("reading", () => {
//     bpsData.text = JSON.stringify({
//       presence: bps.present
//     })
//   });
//   sensors.push(bps);
//   bps.start();
// } else {
//   bpsLabel.style.display = "none";
//   bpsData.style.display = "none";
// }

// if (Gyroscope) {
//   const gyro = new Gyroscope({ frequency: 1 });
//   gyro.addEventListener("reading", () => {
//     gyroData.text = JSON.stringify({
//       x: gyro.x ? gyro.x.toFixed(1) : 0,
//       y: gyro.y ? gyro.y.toFixed(1) : 0,
//       z: gyro.z ? gyro.z.toFixed(1) : 0,
//     });
//   });
//   sensors.push(gyro);
//   gyro.start();
// } else {
//   gyroLabel.style.display = "none";
//   gyroData.style.display = "none";
// }

// if (HeartRateSensor) {
//   const hrm = new HeartRateSensor({ frequency: 1 });
//   hrm.addEventListener("reading", () => {
//     hrmData.text = JSON.stringify({
//       heartRate: hrm.heartRate ? hrm.heartRate : 0
//     });
//   });
//   sensors.push(hrm);
//   hrm.start();
// } else {
//   hrmLabel.style.display = "none";
//   hrmData.style.display = "none";
// }

// if (OrientationSensor) {
//   const orientation = new OrientationSensor({ frequency: 60 });
//   orientation.addEventListener("reading", () => {
//     orientationData.text = JSON.stringify({
//       quaternion: orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(1)) : null
//     });
//   });
//   sensors.push(orientation);
//   orientation.start();
// } else {
//   orientationLabel.style.display = "none";
//   orientationData.style.display = "none";
// }

// display.addEventListener("change", () => {
//   // Automatically stop all sensors when the screen is off to conserve battery
//   display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
// });

import document from "document";
import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../resources/utils";
import { today } from "user-activity"

// Update the clock every minute
clock.granularity = 'seconds';

const timeLabel = document.getElementById("timeLabel");
let dateLabel = document.getElementById("dateLabel");
let secLabel = document.getElementById("secLabel");

let stepsThisPoint = 0;
let stepsOffset = today.adjusted.steps;
let currentPoint;

let testPoint = true;

clock.ontick = (evt) => {
  let today_dt = evt.date;
  let hours = today_dt.getHours();
  let hoursFmted;
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hoursFmted = util.monoDigits(util.zeroPad(hours % 12 || 12));
  } else {
    // 24h format
    hoursFmted = util.monoDigits(util.zeroPad(hours));
  };
  let mins = today_dt.getMinutes();
  let minsFmted = util.monoDigits(util.zeroPad(mins));
  let secs = today_dt.getSeconds();
  let secsFmted = util.monoDigits(util.zeroPad(secs));

  timeLabel.text = `${hoursFmted}:${minsFmted}`;
  secLabel.text = secsFmted;

  let month = util.formattedMonth[today_dt.getMonth()];
  let weekday = util.formattedDays[today_dt.getDay()];
  let day = today_dt.getDate();

  if ((mins === 0 || mins === 15 || mins === 30 || mins === 45) && secs === 0) {
    // Reset steps
    stepsThisPoint = 0;

    if (hour === 0 && minutes === 0) {
      resetPoints();
    }
    currentPoint = util.timeToPoint[hours][mins];
    console.log('setting point!!!!!!');
    setPoint(currentPoint, 0);
  }

  if (currentPoint) {
    setPoint(currentPoint, stepsThisPoint);
  }

  // Calculate steps since the hour
  stepsThisPoint = today.adjusted.steps - stepsOffset;
  // console.log('steps this point are', stepsThisPoint);
  
  // dateLabel.text = `${weekday}, ${month} ${day}`;

  // if (testPoint) {
  //   setPoint(36, 2);
  //   testPoint = false;
  // }
}

var dotCount = 96;

var interval = (Math.PI * 2) / dotCount;

function setPoint(point, height) {
  let pointElement = document.getElementById(`point${point}`);

  var t = interval * point;
  var r = 80;
  var x = 148 + r * Math.cos(t)
  var y = 148 + r * Math.sin(t)

  if (height < 2) {
    height = 2;
  } 

  pointElement.x1 = x;
  pointElement.y1 = y;
  pointElement.x2 = x + height * Math.cos(t);
  pointElement.y2 = y + height * Math.sin(t);
}

function resetPoints() {
  for (var i = 1; i <= dotCount; i++) {
    let pointElement = document.getElementById(`point${i}`);
    
    pointElement.x1 = 149;
    pointElement.y1 = 149;
    pointElement.x2 = 149;
    pointElement.y2 = 149;
  }
}

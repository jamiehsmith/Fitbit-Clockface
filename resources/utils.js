// // Add zero in front of numbers < 10
// export function zeroPad(i) {
//   if (i < 10) {
//     i = "0" + i;
//   }
//   return i;
// }


// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function monoDigits(digits) {
  var ret = "";
  var str = digits.toString();
  for (var index = 0; index < str.length; index++) {
    var num = str.charAt(index);
    ret = ret.concat(hex2a("0x1" + num));
  }
  return ret;
}

// Hex to string
export function hex2a(hex) {
  var str = '';
  for (var index = 0; index < hex.length; index += 2) {
    var val = parseInt(hex.substr(index, 2), 16);
    if (val) str += String.fromCharCode(val);
  }
  return str.toString();
}

// Match time to point
export function timeToPoint() {
 return {
    0: { 0: 36, 15: 37, 30: 38, 45: 39 },
    1: { 0: 40, 15: 41, 30: 42, 45: 43 },
    2: { 0: 44, 15: 45, 30: 46, 45: 47 },
    3: { 0: 48, 15: 49, 30: 50, 45: 51 },
    4: { 0: 52, 15: 53, 30: 54, 45: 55 },
    5: { 0: 56, 15: 57, 30: 58, 45: 59 },
    6: { 0: 60, 15: 61, 30: 62, 45: 63 },
    7: { 0: 64, 15: 65, 30: 66, 45: 67 },
    8: { 0: 68, 15: 69, 30: 70, 45: 71 },
    9: { 0: 72, 15: 73, 30: 74, 45: 75 },
    10: { 0: 76, 15: 77, 30: 78, 45: 79 },
    11: { 0: 80, 15: 81, 30: 82, 45: 83 },
    12: { 0: 84, 15: 85, 30: 86, 45: 87 },
    13: { 0: 88, 15: 89, 30: 90, 45: 91 },
    14: { 0: 92, 15: 93, 30: 94, 45: 95 },
    15: { 0: 96, 15: 1, 30: 2, 45: 3 },
    16: { 0: 4, 15: 5, 30: 6, 45: 7 },
    17: { 0: 8, 15: 9, 30: 10, 45: 11 },
    18: { 0: 12, 15: 13, 30: 14, 45: 15 },
    19: { 0: 16, 15: 17, 30: 18, 45: 19 },
    20: { 0: 20, 15: 21, 30: 22, 45: 23 },
    21: { 0: 24, 15: 25, 30: 26, 45: 27 },
    22: { 0: 28, 15: 29, 30: 30, 45: 31 },
    23: { 0: 32, 15: 33, 30: 34, 45: 35 },    
  }
}

export function formattedMonth() {
  return {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June",
              6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"};
} 

export function formattedDays() {
  return {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
}

// export function getWeatherIcon(code, day) {
//     if (day) {
//         switch(code) {
//             case 200: return "images/weather/wi-day-thunderstorm.png";
//             case 201: return "images/weather/wi-day-thunderstorm.png";
//             case 202: return "images/weather/wi-day-thunderstorm.png";
//             case 210: return "images/weather/wi-day-lightning.png";
//             case 211: return "images/weather/wi-day-lightning.png";
//             case 212: return "images/weather/wi-day-lightning.png";
//             case 221: return "images/weather/wi-day-lightning.png";
//             case 230: return "images/weather/wi-day-thunderstorm.png";
//             case 231: return "images/weather/wi-day-thunderstorm.png";
//             case 232: return "images/weather/wi-day-thunderstorm.png";
//             case 300: return "images/weather/wi-day-sprinkle.png";
//             case 301: return "images/weather/wi-day-sprinkle.png";
//             case 302: return "images/weather/wi-day-rain.png";
//             case 310: return "images/weather/wi-day-rain.png";
//             case 311: return "images/weather/wi-day-rain.png";
//             case 312: return "images/weather/wi-day-rain.png";
//             case 313: return "images/weather/wi-day-rain.png";
//             case 314: return "images/weather/wi-day-rain.png";
//             case 321: return "images/weather/wi-day-sprinkle.png";
//             case 500: return "images/weather/wi-day-sprinkle.png";
//             case 501: return "images/weather/wi-day-rain.png";
//             case 502: return "images/weather/wi-day-rain.png";
//             case 503: return "images/weather/wi-day-rain.png";
//             case 504: return "images/weather/wi-day-rain.png";
//             case 511: return "images/weather/wi-day-rain-mix.png";
//             case 520: return "images/weather/wi-day-showers.png";
//             case 521: return "images/weather/wi-day-showers.png";
//             case 522: return "images/weather/wi-day-showers.png";
//             case 531: return "images/weather/wi-day-storm-showers.png";
//             case 600: return "images/weather/wi-day-snow.png";
//             case 601: return "images/weather/wi-day-sleet.png";
//             case 602: return "images/weather/wi-day-snow.png";
//             case 611: return "images/weather/wi-day-rain-mix.png";
//             case 612: return "images/weather/wi-day-rain-mix.png";
//             case 615: return "images/weather/wi-day-rain-mix.png";
//             case 616: return "images/weather/wi-day-rain-mix.png";
//             case 620: return "images/weather/wi-day-rain-mix.png";
//             case 621: return "images/weather/wi-day-snowcase .png";
//             case 622: return "images/weather/wi-day-snow.png";
//             case 701: return "images/weather/wi-day-showers.png";
//             case 711: return "images/weather/wi-smoke.png";
//             case 721: return "images/weather/wi-day-haze.png";
//             case 731: return "images/weather/wi-dust.png";
//             case 741: return "images/weather/wi-day-fog.png";
//             case 761: return "images/weather/wi-dust.png";
//             case 762: return "images/weather/wi-dust.png";
//             case 781: return "images/weather/wi-tornado.png";
//             case 800: return "images/weather/wi-day-sunny.png";
//             case 801: return "images/weather/wi-day-cloudy-gusts.png";
//             case 802: return "images/weather/wi-day-cloudy-gusts.png";
//             case 803: return "images/weather/wi-day-cloudy-gusts.png";
//             case 804: return "images/weather/wi-day-sunny-overcast.png";
//             case 900: return "images/weather/wi-tornado.png";
//             case 902: return "images/weather/wi-hurricane.png";
//             case 903: return "images/weather/wi-snowflake-cold.png";
//             case 904: return "images/weather/wi-hot.png";
//             case 906: return "images/weather/wi-day-hail.png";
//             case 957: return "images/weather/wi-strong-wind.png";
//             default: return "";
//         }
//     } else {
//         switch(code) {
//             case 200: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 201: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 202: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 210: return "images/weather/wi-night-alt-lightning.png";
//             case 211: return "images/weather/wi-night-alt-lightning.png";
//             case 212: return "images/weather/wi-night-alt-lightning.png";
//             case 221: return "images/weather/wi-night-alt-lightning.png";
//             case 230: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 231: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 232: return "images/weather/wi-night-alt-thunderstorm.png";
//             case 300: return "images/weather/wi-night-alt-sprinkle.png";
//             case 301: return "images/weather/wi-night-alt-sprinkle.png";
//             case 302: return "images/weather/wi-night-alt-rain.png";
//             case 310: return "images/weather/wi-night-alt-rain.png";
//             case 311: return "images/weather/wi-night-alt-rain.png";
//             case 312: return "images/weather/wi-night-alt-rain.png";
//             case 313: return "images/weather/wi-night-alt-rain.png";
//             case 314: return "images/weather/wi-night-alt-rain.png";
//             case 321: return "images/weather/wi-night-alt-sprinkle.png";
//             case 500: return "images/weather/wi-night-alt-sprinkle.png";
//             case 501: return "images/weather/wi-night-alt-rain.png";
//             case 502: return "images/weather/wi-night-alt-rain.png";
//             case 503: return "images/weather/wi-night-alt-rain.png";
//             case 504: return "images/weather/wi-night-alt-rain.png";
//             case 511: return "images/weather/wi-night-alt-rain-mix.png";
//             case 520: return "images/weather/wi-night-alt-showers.png";
//             case 521: return "images/weather/wi-night-alt-showers.png";
//             case 522: return "images/weather/wi-night-alt-showers.png";
//             case 531: return "images/weather/wi-night-alt-storm-showers.png";
//             case 600: return "images/weather/wi-night-alt-snow.png";
//             case 601: return "images/weather/wi-night-alt-sleet.png";
//             case 602: return "images/weather/wi-night-alt-snow.png";
//             case 611: return "images/weather/wi-night-alt-rain-mix.png";
//             case 612: return "images/weather/wi-night-alt-rain-mix.png";
//             case 615: return "images/weather/wi-night-alt-rain-mix.png";
//             case 616: return "images/weather/wi-night-alt-rain-mix.png";
//             case 620: return "images/weather/wi-night-alt-rain-mix.png";
//             case 621: return "images/weather/wi-night-alt-snow.png";
//             case 622: return "images/weather/wi-night-alt-snow.png";
//             case 701: return "images/weather/wi-night-alt-showers.png";
//             case 711: return "images/weather/wi-smoke.png";
//             case 721: return "images/weather/wi-day-haze.png";
//             case 731: return "images/weather/wi-dust.png";
//             case 741: return "images/weather/wi-night-fog.png";
//             case 761: return "images/weather/wi-dust.png";
//             case 762: return "images/weather/wi-dust.png";
//             case 781: return "images/weather/wi-tornado.png";
//             case 800: return "images/weather/wi-night-clear.png";
//             case 801: return "images/weather/wi-night-alt-cloudy-gusts.png";
//             case 802: return "images/weather/wi-night-alt-cloudy-gusts.png";
//             case 803: return "images/weather/wi-night-alt-cloudy-gusts.png";
//             case 804: return "images/weather/wi-night-alt-cloudy.png";
//             case 900: return "images/weather/wi-tornado.png";
//             case 902: return "images/weather/wi-hurricane.png";
//             case 903: return "images/weather/wi-snowflake-cold.png";
//             case 904: return "images/weather/wi-hot.png";
//             case 906: return "images/weather/wi-night-alt-hail.png";
//             case 957: return "images/weather/wi-strong-wind.png";
//             default: return "";
//         }
//     }
// }
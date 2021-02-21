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

export const timePoints = {
    0: { 0: { point: 71, visible: false }, 15: { point: 72, visible: false }, 30: { point: 73, visible: false }, 45: { point: 74, visible: false } },
    1: { 0: { point: 75, visible: false }, 15: { point: 76, visible: false }, 30: { point: 77, visible: false }, 45: { point: 78, visible: false } },
    2: { 0: { point: 79, visible: false }, 15: { point: 80, visible: false }, 30: { point: 81, visible: false }, 45: { point: 82, visible: false } },
    3: { 0: { point: 83, visible: false }, 15: { point: 84, visible: false }, 30: { point: 85, visible: false }, 45: { point: 86, visible: false } },
    4: { 0: { point: 87, visible: false }, 15: { point: 88, visible: false }, 30: { point: 89, visible: false }, 45: { point: 90, visible: false } },
    5: { 0: { point: 91, visible: false }, 15: { point: 92, visible: false }, 30: { point: 93, visible: false }, 45: { point: 94, visible: false } },
    6: { 0: { point: 95, visible: false }, 15: { point: 0, visible: false }, 30: { point: 1, visible: false }, 45: { point: 2, visible: false } },
    7: { 0: { point: 3, visible: false }, 15: { point: 4, visible: false }, 30: { point: 5, visible: false }, 45: { point: 6, visible: false } },
    8: { 0: { point: 7, visible: false }, 15: { point: 8, visible: false }, 30: { point: 9, visible: false }, 45: { point: 10, visible: false } },
    9: { 0: { point: 11, visible: false }, 15: { point: 12, visible: false }, 30: { point: 13, visible: false }, 45: { point: 14, visible: false } },
    10: { 0: { point: 15, visible: false }, 15: { point: 16, visible: false }, 30: { point: 17, visible: false }, 45: { point: 18, visible: false } },
    11: { 0: { point: 19, visible: false }, 15: { point: 20, visible: false }, 30: { point: 21, visible: false }, 45: { point: 22, visible: false } },
    12: { 0: { point: 23, visible: false }, 15: { point: 24, visible: false }, 30: { point: 25, visible: false }, 45: { point: 26, visible: false } },
    13: { 0: { point: 27, visible: false }, 15: { point: 28, visible: false }, 30: { point: 29, visible: false }, 45: { point: 30, visible: false } },
    14: { 0: { point: 31, visible: false }, 15: { point: 32, visible: false }, 30: { point: 33, visible: false }, 45: { point: 34, visible: false } },
    15: { 0: { point: 35, visible: false }, 15: { point: 36, visible: false }, 30: { point: 37, visible: false }, 45: { point: 38, visible: false } },
    16: { 0: { point: 39, visible: false }, 15: { point: 40, visible: false }, 30: { point: 41, visible: false }, 45: { point: 42, visible: false } },
    17: { 0: { point: 43, visible: false }, 15: { point: 44, visible: false }, 30: { point: 45, visible: false }, 45: { point: 46, visible: false } },
    18: { 0: { point: 47, visible: false }, 15: { point: 48, visible: false }, 30: { point: 49, visible: false }, 45: { point: 50, visible: false } },
    19: { 0: { point: 51, visible: false }, 15: { point: 52, visible: false }, 30: { point: 53, visible: false }, 45: { point: 54, visible: false } },
    20: { 0: { point: 55, visible: false }, 15: { point: 56, visible: false }, 30: { point: 57, visible: false }, 45: { point: 58, visible: false } },
    21: { 0: { point: 59, visible: false }, 15: { point: 60, visible: false }, 30: { point: 61, visible: false }, 45: { point: 62, visible: false } },
    22: { 0: { point: 63, visible: false }, 15: { point: 64, visible: false }, 30: { point: 65, visible: false }, 45: { point: 66, visible: false } },
    23: { 0: { point: 67, visible: false }, 15: { point: 68, visible: false }, 30: { point: 69, visible: false }, 45: { point: 70, visible: false } },
}

// Match time to point
export function timeToPoint() {
 return {
    0: { 0: 35, 15: 36, 30: 37, 45: 38 },
    1: { 0: 39, 15: 40, 30: 41, 45: 42 },
    2: { 0: 43, 15: 44, 30: 45, 45: 46 },
    3: { 0: 47, 15: 48, 30: 49, 45: 50 },
    4: { 0: 51, 15: 52, 30: 53, 45: 54 },
    5: { 0: 55, 15: 56, 30: 57, 45: 58 },
    6: { 0: 59, 15: 60, 30: 61, 45: 62 },
    7: { 0: 63, 15: 64, 30: 65, 45: 66 },
    8: { 0: 67, 15: 68, 30: 69, 45: 70 },
    9: { 0: 71, 15: 72, 30: 73, 45: 74 },
    10: { 0: 75, 15: 76, 30: 77, 45: 78 },
    11: { 0: 79, 15: 80, 30: 81, 45: 82 },
    12: { 0: 83, 15: 84, 30: 85, 45: 86 },
    13: { 0: 87, 15: 88, 30: 89, 45: 90 },
    14: { 0: 91, 15: 92, 30: 93, 45: 94 },
    15: { 0: 95, 15: 0, 30: 1, 45: 2 },
    16: { 0: 3, 15: 4, 30: 5, 45: 6 },
    17: { 0: 7, 15: 8, 30: 9, 45: 10 },
    18: { 0: 11, 15: 12, 30: 13, 45: 14 },
    19: { 0: 15, 15: 16, 30: 17, 45: 18 },
    20: { 0: 19, 15: 20, 30: 21, 45: 22 },
    21: { 0: 23, 15: 24, 30: 25, 45: 26 },
    22: { 0: 27, 15: 28, 30: 29, 45: 30 },
    23: { 0: 31, 15: 32, 30: 33, 45: 34 },    
  }
}

export function formattedMonth() {
  return {0: "Jan", 1: "Feb", 2: "March", 3: "April", 4: "May", 5: "June",
    6: "July", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"};
} 

export function formattedDays() {
  return {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"};
}

export function getWeatherIcon(code, day) {
    if (day) {
        switch(code) {
            case 200: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 201: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 202: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 210: return "icons/weather_icons/wi-day-lightning.png";
            case 211: return "icons/weather_icons/wi-day-lightning.png";
            case 212: return "icons/weather_icons/wi-day-lightning.png";
            case 221: return "icons/weather_icons/wi-day-lightning.png";
            case 230: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 231: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 232: return "icons/weather_icons/wi-day-thunderstorm.png";
            case 300: return "icons/weather_icons/wi-day-sprinkle.png";
            case 301: return "icons/weather_icons/wi-day-sprinkle.png";
            case 302: return "icons/weather_icons/wi-day-rain.png";
            case 310: return "icons/weather_icons/wi-day-rain.png";
            case 311: return "icons/weather_icons/wi-day-rain.png";
            case 312: return "icons/weather_icons/wi-day-rain.png";
            case 313: return "icons/weather_icons/wi-day-rain.png";
            case 314: return "icons/weather_icons/wi-day-rain.png";
            case 321: return "icons/weather_icons/wi-day-sprinkle.png";
            case 500: return "icons/weather_icons/wi-day-sprinkle.png";
            case 501: return "icons/weather_icons/wi-day-rain.png";
            case 502: return "icons/weather_icons/wi-day-rain.png";
            case 503: return "icons/weather_icons/wi-day-rain.png";
            case 504: return "icons/weather_icons/wi-day-rain.png";
            case 511: return "icons/weather_icons/wi-day-rain-mix.png";
            case 520: return "icons/weather_icons/wi-day-showers.png";
            case 521: return "icons/weather_icons/wi-day-showers.png";
            case 522: return "icons/weather_icons/wi-day-showers.png";
            case 531: return "icons/weather_icons/wi-day-storm-showers.png";
            case 600: return "icons/weather_icons/wi-day-snow.png";
            case 601: return "icons/weather_icons/wi-day-sleet.png";
            case 602: return "icons/weather_icons/wi-day-snow.png";
            case 611: return "icons/weather_icons/wi-day-rain-mix.png";
            case 612: return "icons/weather_icons/wi-day-rain-mix.png";
            case 615: return "icons/weather_icons/wi-day-rain-mix.png";
            case 616: return "icons/weather_icons/wi-day-rain-mix.png";
            case 620: return "icons/weather_icons/wi-day-rain-mix.png";
            case 621: return "icons/weather_icons/wi-day-snowcase .png";
            case 622: return "icons/weather_icons/wi-day-snow.png";
            case 701: return "icons/weather_icons/wi-day-showers.png";
            case 711: return "icons/weather_icons/wi-smoke.png";
            case 721: return "icons/weather_icons/wi-day-haze.png";
            case 731: return "icons/weather_icons/wi-dust.png";
            case 741: return "icons/weather_icons/wi-day-fog.png";
            case 761: return "icons/weather_icons/wi-dust.png";
            case 762: return "icons/weather_icons/wi-dust.png";
            case 781: return "icons/weather_icons/wi-tornado.png";
            case 800: return "icons/weather_icons/wi-day-sunny.png";
            case 801: return "icons/weather_icons/wi-day-cloudy-gusts.png";
            case 802: return "icons/weather_icons/wi-day-cloudy-gusts.png";
            case 803: return "icons/weather_icons/wi-day-cloudy-gusts.png";
            case 804: return "icons/weather_icons/wi-day-sunny-overcast.png";
            case 900: return "icons/weather_icons/wi-tornado.png";
            case 902: return "icons/weather_icons/wi-hurricane.png";
            case 903: return "icons/weather_icons/wi-snowflake-cold.png";
            case 904: return "icons/weather_icons/wi-hot.png";
            case 906: return "icons/weather_icons/wi-day-hail.png";
            case 957: return "icons/weather_icons/wi-strong-wind.png";
            default: return "";
        }
    } else {
        switch(code) {
            case 200: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 201: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 202: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 210: return "icons/weather_icons/wi-night-alt-lightning.png";
            case 211: return "icons/weather_icons/wi-night-alt-lightning.png";
            case 212: return "icons/weather_icons/wi-night-alt-lightning.png";
            case 221: return "icons/weather_icons/wi-night-alt-lightning.png";
            case 230: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 231: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 232: return "icons/weather_icons/wi-night-alt-thunderstorm.png";
            case 300: return "icons/weather_icons/wi-night-alt-sprinkle.png";
            case 301: return "icons/weather_icons/wi-night-alt-sprinkle.png";
            case 302: return "icons/weather_icons/wi-night-alt-rain.png";
            case 310: return "icons/weather_icons/wi-night-alt-rain.png";
            case 311: return "icons/weather_icons/wi-night-alt-rain.png";
            case 312: return "icons/weather_icons/wi-night-alt-rain.png";
            case 313: return "icons/weather_icons/wi-night-alt-rain.png";
            case 314: return "icons/weather_icons/wi-night-alt-rain.png";
            case 321: return "icons/weather_icons/wi-night-alt-sprinkle.png";
            case 500: return "icons/weather_icons/wi-night-alt-sprinkle.png";
            case 501: return "icons/weather_icons/wi-night-alt-rain.png";
            case 502: return "icons/weather_icons/wi-night-alt-rain.png";
            case 503: return "icons/weather_icons/wi-night-alt-rain.png";
            case 504: return "icons/weather_icons/wi-night-alt-rain.png";
            case 511: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 520: return "icons/weather_icons/wi-night-alt-showers.png";
            case 521: return "icons/weather_icons/wi-night-alt-showers.png";
            case 522: return "icons/weather_icons/wi-night-alt-showers.png";
            case 531: return "icons/weather_icons/wi-night-alt-storm-showers.png";
            case 600: return "icons/weather_icons/wi-night-alt-snow.png";
            case 601: return "icons/weather_icons/wi-night-alt-sleet.png";
            case 602: return "icons/weather_icons/wi-night-alt-snow.png";
            case 611: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 612: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 615: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 616: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 620: return "icons/weather_icons/wi-night-alt-rain-mix.png";
            case 621: return "icons/weather_icons/wi-night-alt-snow.png";
            case 622: return "icons/weather_icons/wi-night-alt-snow.png";
            case 701: return "icons/weather_icons/wi-night-alt-showers.png";
            case 711: return "icons/weather_icons/wi-smoke.png";
            case 721: return "icons/weather_icons/wi-day-haze.png";
            case 731: return "icons/weather_icons/wi-dust.png";
            case 741: return "icons/weather_icons/wi-night-fog.png";
            case 761: return "icons/weather_icons/wi-dust.png";
            case 762: return "icons/weather_icons/wi-dust.png";
            case 781: return "icons/weather_icons/wi-tornado.png";
            case 800: return "icons/weather_icons/wi-night-clear.png";
            case 801: return "icons/weather_icons/wi-night-alt-cloudy-gusts.png";
            case 802: return "icons/weather_icons/wi-night-alt-cloudy-gusts.png";
            case 803: return "icons/weather_icons/wi-night-alt-cloudy-gusts.png";
            case 804: return "icons/weather_icons/wi-night-alt-cloudy.png";
            case 900: return "icons/weather_icons/wi-tornado.png";
            case 902: return "icons/weather_icons/wi-hurricane.png";
            case 903: return "icons/weather_icons/wi-snowflake-cold.png";
            case 904: return "icons/weather_icons/wi-hot.png";
            case 906: return "icons/weather_icons/wi-night-alt-hail.png";
            case 957: return "icons/weather_icons/wi-strong-wind.png";
            default: return "";
        }
    }
}
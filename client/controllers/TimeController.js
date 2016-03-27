var getTime = function() {
  var date = new Date();
  var hours = date.getHours().toString();
  var minutes = date.getMinutes().toString();
  if (hours.length < 2) {
    hours = '0' + hours;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  return hours + minutes;
};

var timeController = {

  // takes a time string as input and returns a date object for that time today
  timeToDate: function (time) {
    var now = new Date();
    var month = now.getMonth() + 1,
        day = now.getDate(),
        year = now.getFullYear();
    if (now.getHours() > time.split(':')[0]) day++;
    var input = [month, day, year, time].join(" ");
    return new Date(Date.parse(input));
  },

  timeToMS: function (time) {
    if (time) {
      console.log(timeController.timeToDate(time).getTime());
      return timeController.timeToDate(time).getTime();
    } else {
      return undefined;
    }
  },

  msToTime: function (ms) {
    if (typeof ms === "string") ms = Number(ms);
    var date = new Date(ms);
    var output = [date.getHours()]
    if (date.getMinutes()) output.push(':' + ('0' + date.getMinutes()).slice(-2));
    if (output[0] < 12) {
      output.push(' AM');
    } else {
      output.push(' PM');
    }
    if (output[0] > 12) output[0] -= 12;
    if (output[0] === 0) output[0] = 12;
    return output.join('');
  },

  hoursToMS: function(hours) {
    return hours * 3600000;
  },

  minutesToMS: function(minutes) {
    return minutes * 60000;
  }, 

  msToDuration: function(ms) {
  var hourStr = " hour ";
  var convertMin, minutes, hours, minStr;
  
    if(!Number.isInteger(ms / 3600000)) {
      minStr = " minutes";
      minutes = ms % 3600000;
      hours = Math.floor(ms / 3600000);
      if(hours > 1) {
        hourStr = " hours ";
      }
      convertMin = Math.floor(minutes/60000);
      if (convertMin === 1) {
        minStr = " minute";
      }
      if (hours > 0) {
        return hours + hourStr + convertMin + minStr;
      } else {
        return convertMin + minStr;
      }
    } else {
      hours = Math.floor(ms / 3600000);
      
      if(hours > 1) {
        hourStr = " hours";
      }
      return hours + hourStr;
    }
  },

  stringifyTime: function(spot) {
    var timeString = "";
    if (Number(spot.start) > new Date().getTime()) {
      timeString = "in " + timeController.msToDuration(Number(spot.start) + Number(spot.end) - new Date().getTime());
    } else {
      timeString = timeController.msToDuration(Number(spot.end) + Number(spot.start) - new Date().getTime()) + " left";
    }
    return timeString;
  }
}

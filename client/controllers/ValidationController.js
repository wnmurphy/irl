var ValidationController = {
  inputIsValid: function(input) {
      var regEx = /^[0-9a-zA-Z]{1,16}$/;

      // Validate the input if it's a string.
      if (Object.prototype.toString.call(input) === "[object String]") {
        return string.match(regEx);  
      } 
      
      // Validate any strings that are properties of an object.
      else if (Object.prototype.toString.call(input) === "[object Object]") {
        for(var key in input) {
          if (Object.prototype.toString.call(input[key]) === "[object String]") {
            if(input[key].match(regEx) === false) {
              return false;
            }
          }
        }
        return true;
      }
    }
};
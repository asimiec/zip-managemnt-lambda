//import your handler file or main file of Lambda
let handler = require("./src/index");

handler.handler(
  {}, //event
  {}, //content
  function(data, ss) {
    //callback function with two arguments
    console.log(data);
  }
);

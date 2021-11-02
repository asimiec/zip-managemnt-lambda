// lambda-like handler function
const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
module.exports.handler = async event => {
    require('./routes/routes.js')(app, fs);
    const server = app.listen(3002, () => {
        console.log("listening on port %s...", server.address().port);
      });
  
};

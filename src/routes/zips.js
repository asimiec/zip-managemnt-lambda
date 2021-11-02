
const { Validator } = require('node-input-validator');
var logger          = require('log4js').getLogger();
logger.level        = 'debug';
const zipRoutes = (app, fs) => {

  // variables
  const dataPath = './src/data/data.json';

  // helper methods
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        logger.error("Error Response : " , err);
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, err => {
      if (err) {
        logger.error("Error Response : " , err);
        throw err;
      }

      callback();
    });
  };

  const condition = (searchText, params) => {
    let regexp
    if (params) {
      regexp = new RegExp(params, "i");
      return regexp.test(searchText);
    } else {
      return true;
    }
  };

  // READ
  app.get("/zips", (req, res) => {
    readFile(data => {
      res.send(data);
    }, true);
  });

  app.get("/search-by-zip/:zip", (req, res) => {
    const v = new Validator(req.params, {
      zip: 'required|maxLength:5'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , err);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          let rest = data.filter(daata => {
            return condition(daata.zip, req.params.zip);
          });
          res.send(rest);
        }, true);
      }
    })

  });

  app.get("/search-by-city/:primary_city", (req, res) => {
    const v = new Validator(req.params, {
      primary_city: 'required|minLength:3'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , v.errors);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          let rest = data.filter(daata => {
            return condition(daata.primary_city, req.params.primary_city);
          });
          res.send(rest);
        }, true);
      }
    })
  });

  app.get("/search-by-longitude/:longitude", (req, res) => {
    const v = new Validator(req.params, {
      longitude: 'required|minLength:3'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , v.errors);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          let rest = data.filter(daata => {
            return condition(daata.longitude, req.params.longitude);
          });
          res.send(rest);
        }, true);
      }
    })
  });


  app.get("/search-by-latitude/:latitude", (req, res) => {
    const v = new Validator(req.params, {
      latitude: 'required|minLength:3'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , v.errors);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          let rest = data.filter(daata => {
            return condition(daata.latitude, req.params.latitude);
          });
          res.send(rest);
        }, true);
      }
    })
  });

  function multiIncludes(text, values) {
    return values.some(function (val) {
      return text.includes(val);
    });
  }
  app.get("/search-by-keyword/:keyword", (req, res) => {
    const v = new Validator(req.params, {
      keyword: 'required|minLength:2'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , v.errors);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          let rest = data.filter(daata => {
            return multiIncludes(req.params.keyword, Object.values(daata))
          });
          res.send(rest);
        }, true);

      }
    })

  });


  // CREATE
  app.post('/zips', (req, res) => {
    const v = new Validator(req.body, {
      zip: 'required|minLength:5',
      type: 'required',
      primary_city: 'required',
      state: 'required',
      county: 'required',
      timezone: 'required',
      area_codes: 'required',
      latitude: 'required',
      longitude: 'required',
      country: 'required',
      estimated_population: 'required'
    });
    v.check().then((matched) => {
      if (!matched) {
        logger.error("Error Response : " , v.errors);
        res.status(422).send(v.errors);
      } else {
        readFile(data => {
          // add the new user
          newData = [req.body, ...data]
          writeFile(JSON.stringify(newData, null, 2), () => {
            res.status(200).send('new user added');
          });
        },
          true);
      }
    });

  });


  // // UPDATE
  // app.put('/zips/:id', (req, res) => {

  //     readFile(data => {

  //         // add the new user
  //         const userId = req.params["id"];
  //         data[userId] = req.body;

  //         writeFile(JSON.stringify(data, null, 2), () => {
  //             res.status(200).send(`users id:${userId} updated`);
  //         });
  //     },
  //         true);
  // });

  //   const server = app.listen(3002, () => {
  //     console.log("listening on port %s...", server.address().port);
  //   });
};

module.exports = zipRoutes;

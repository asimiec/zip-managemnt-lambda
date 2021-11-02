// import other routes
const zipRoutes = require('./zips');

const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // // other routes
    zipRoutes(app, fs);

};

module.exports = appRouter;
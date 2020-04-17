const express = require('express');
const routes = express.Router();

const iFoodController = require('./controllers/iFoodController');

routes.get("/fetchFood", iFoodController.fetchFood);
routes.get("/test", iFoodController.test);

module.exports = routes;

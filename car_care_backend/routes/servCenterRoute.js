const express = require('express');
const { centerList } = require('../controllers/ServiceCenterController');

const centerRouter = express.Router();

centerRouter.get("/list", centerList);

module.exports = centerRouter;

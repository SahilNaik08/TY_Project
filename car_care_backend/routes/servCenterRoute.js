import express from 'express'
import { centerList } from '../controllers/ServiceCenterController.js';

const centerRouter = express.Router();

centerRouter.get("/list",centerList)

export default centerRouter;
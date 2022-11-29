/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

import express from "express";

// import authentication library
import dotenv from "dotenv";
dotenv.config();

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// MongoDB Models

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

export default router;

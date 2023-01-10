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

import {
  RequestDataType,
  ResponseDataType,
  TypedGetRequest,
  TypedResponse,
  AsParsedQs,
} from "shared";

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.get(
  "/data",
  (req: TypedGetRequest<AsParsedQs<RequestDataType>>, res: TypedResponse<ResponseDataType>) => {
    const testData: ResponseDataType = {
      name: "Test",
      description: "random API data",
      amount: 0,
    };
    testData.amount = parseInt(req.query.amount) * 2;
    res.send(testData);
  }
);

// MongoDB Models

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

export default router;

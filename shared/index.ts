export type ResponseDataType = {
  name: string;
  description: string;
  amount: number;
};

export type RequestDataType = {
  amount: number;
};

import { Send, Query } from "express-serve-static-core";
import { Request, Response } from "express";

export interface TypedPostRequest<T> extends Request {
  body: T;
}

/** Get request query has to contain all strings, so we can pass it through AsParsedQs to
 * maintain understanding while still satisfying http constraint */
export type AsParsedQs<Type> = {
  [Property in keyof Type]: string;
};

export interface TypedGetRequest<T extends Query> extends Request {
  query: T;
}

export interface TypedResponse<ResBody> extends Response {
  send: Send<ResBody, this>;
}

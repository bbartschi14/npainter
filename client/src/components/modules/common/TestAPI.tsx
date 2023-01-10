import React, { useEffect, useState } from "react";
import { get } from "../../../utilities";
import { RequestDataType, ResponseDataType } from "shared";

const TestAPI = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    get<RequestDataType, ResponseDataType>("api/data", { amount: 20 }).then((res) =>
      setText(`${res.name} is ${res.description} at ${res.amount}`)
    );
  }, []);

  return <div>{text}</div>;
};

export default TestAPI;

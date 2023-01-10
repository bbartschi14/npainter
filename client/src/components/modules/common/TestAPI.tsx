import React, { useEffect, useState } from "react";
import { get } from "../../../utilities";

const TestAPI = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    get("/data", { amount: 30 }).then((res) =>
      setText(`${res.name} is ${res.description} at ${res.amount}`)
    );
  }, []);

  return <div>{text}</div>;
};

export default TestAPI;

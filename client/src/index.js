import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.tsx";
import { createRoot } from "react-dom/client";
import "./utilities.css";

// renders React Component "Root" into the DOM element with ID "root"
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
// allows for live updating
import.meta.webpackHot.accept();

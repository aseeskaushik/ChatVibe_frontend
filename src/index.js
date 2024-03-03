import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import "./index.css";
import App from "./App";
axios.defaults.baseURL = "https://chatnovo-backend.vercel.app/";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

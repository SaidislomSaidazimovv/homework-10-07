import React from "react";
import "./App.css";
import Routers from "./routes";
import { NavLink } from "react-router-dom";

const App = () => {
  return (
    <>
      <ul className="bg-gray-700 p-5 flex justify-center space-x-5">
        <li>
          <NavLink className={"text-white"} to={'/'}>Home</NavLink>
        </li>
        <li>
          <NavLink className={"text-white"} to={'/about'}>About</NavLink>
        </li>
      </ul>
      <Routers />
    </>
  );
};

export default App;

import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Courses from "./routes/Courses";

function App() {
  return <Outlet />;
}

export default App;

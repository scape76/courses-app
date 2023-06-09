import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Courses, { loader as coursesLoader } from "./routes/Courses";
import Course, { loader as courseLoader } from "./routes/Course";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Courses />,
        loader: coursesLoader,
      },
      {
        path: "/:courseId",
        element: <Course />,
        loader: courseLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Stats, { loader, loaderCalories } from "./Stats";
import Calories from "./components/stats/calories/Calories";
import Runs from "./components/stats/runs/Runs";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/stats",
    id: "stats",
    element: <Stats />,
    loader,
    children: [
      {
        path: "calories",
        loader: loaderCalories,
        element: <Calories />,
      },
      {
        path: "runs",
        element: <Runs />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

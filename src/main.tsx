import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Stats, { loader } from "./Stats";
import Calories from "./components/stats/calories/Calories";
import CaloriesTeam from "./components/stats/calories-team/CaloriesTeam";
import Runs from "./components/stats/runs/Runs";
import Weight from "./components/stats/weight/Weight";
import RunsAverage from "./components/stats/runs-average/RunsAverage";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/stats/:week/",
    id: "stats",
    element: <Stats />,
    loader,
    children: [
      {
        path: "calories",
        element: <Calories />,
      },
      {
        path: "calories-team",
        element: <CaloriesTeam />,
      },
      {
        path: "runs",
        element: <Runs />,
      },
      {
        path: "runs-average",
        element: <RunsAverage />,
      },
      {
        path: "weight",
        element: <Weight />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

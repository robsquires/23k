import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Stats, { loader as statsLoader } from "./Stats";
import Calories from "./components/stats/calories/Calories";
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
    loader: statsLoader,
    children: [
      {
        path: "calories",
        element: <Calories />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

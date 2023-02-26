import { Outlet } from "react-router-dom";
import { request, QUERY } from "./lib/graphql";

import "./stats.css";

export default function Stats() {
  return (
    <div className="stats-container">
      <Outlet context={{ width: 1400, height: 800 }} />
    </div>
  );
}

export async function loader() {
  return await request(QUERY.ALL_MEASUREMENTS);
}

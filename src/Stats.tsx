import { Outlet } from "react-router-dom";

export default function Stats() {
  return <Outlet context={{ width: 1400, height: 800 }} />;
}

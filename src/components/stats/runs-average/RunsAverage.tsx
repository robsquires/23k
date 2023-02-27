import uniq from "lodash.uniq";
import { useParams, useRouteLoaderData } from "react-router-dom";
import { Table } from "./Table";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
}

type Measurement = {
  type: string;
  athlete: string;
  value: number;
  week: string;
};
type Data = {
  Measurement: Measurement[];
};

const athletes: {
  [key: string]: {
    x: string;
    y: number;
  }[];
} = {};

export type Props = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const RunsAverage = () => {
  const data = useRouteLoaderData("stats") as Data;
  const params = useParams();

  const runData = data.Measurement.filter(
    (d) => d.type === "RUN" && new Date(d.week) <= new Date(params.week || "")
  );
  const weeks = uniq(runData.map((d) => d.week)).sort((a, b) => {
    return new Date(a) < new Date(b) ? 1 : -1;
  });

  runData.forEach((d) => {
    if (athletes[d.athlete] === undefined) {
      athletes[d.athlete] = [];
    }
    const athlete = d.athlete;
    const thisWeek = new Date(d.week);
    const numWeeks = weeks.filter((week) => thisWeek >= new Date(week)).length;

    const vals = runData.filter((d) => {
      return d.athlete === athlete && thisWeek >= new Date(d.week);
    });

    const average = Sum(vals.map((d) => d.value)) / numWeeks;

    athletes[d.athlete].push({ x: d.week, y: average });
  });

  const tableData: {
    athlete: string;
    change: string;
  }[] = [];

  Object.entries(athletes).forEach(([athlete, data]) => {
    const weekData = data.reduce(
      (acc, d) => ({ ...acc, [d.x]: d.y.toFixed(1) }),
      {}
    );
    const change = (data[data.length - 1].y - data[data.length - 2].y).toFixed(
      1
    );
    tableData.push({ athlete, change, ...weekData });
  });

  tableData.sort((a, b) => (a.athlete > b.athlete ? 1 : -1));

  return (
    <div className="runs stats">
      <div
        className="stats-title"
        style={{
          height: "175px",
          color: "#16a34a",
        }}
      >
        23k for days
      </div>
      <Table
        columns={["athlete", "change", ...weeks].map((k) => ({
          Header:
            k === "athlete" || k === "change"
              ? ""
              : k === params.week
              ? "This week"
              : new Date(k).toLocaleDateString("en-gb", {
                  month: "short",
                  day: "numeric",
                }),
          accessor: k,
        }))}
        data={tableData}
      />
    </div>
  );
};

export default RunsAverage;

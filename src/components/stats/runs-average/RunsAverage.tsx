import { useSearchParams, useRouteLoaderData } from "react-router-dom";
import { filterByDate } from "../../../lib/filters";
import { Table, TableRow, WeekData } from "./Table";
import round from "lodash.round";

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

type DataByAthlete = {
  [athlete: string]: {
    week: string;
    average: number;
    actual: number;
  }[];
};

export type Props = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const RunsAverage = () => {
  const data = useRouteLoaderData("stats") as Data;
  const [params] = useSearchParams();
  const monthSummary = !!params.get("month");

  const runData = data.Measurement.filter(
    (d) => d.type === "RUN" && filterByDate(params, d.week)
  );

  const weeks = [...new Set(runData.map((d) => d.week).values())].sort(
    (a, b) => {
      return new Date(a) < new Date(b) ? 1 : -1;
    }
  );
  const athletes = [...new Set(runData.map((d) => d.athlete).values())];

  // pad out with zero weeks
  weeks.forEach((week) => {
    athletes.forEach((athlete) => {
      const measurement = runData.find(
        (d) => d.week === week && d.athlete === athlete
      );
      if (!measurement) {
        runData.push({ type: "RUN", athlete, week, value: 0 });
      }
    });
  });
  const dataByAthlete: DataByAthlete = {};
  runData.forEach((d) => {
    if (dataByAthlete[d.athlete] === undefined) {
      dataByAthlete[d.athlete] = [];
    }
    const athlete = d.athlete;
    const thisWeek = new Date(d.week);
    const numWeeks = weeks.filter((week) => thisWeek >= new Date(week)).length;

    const vals = runData.filter((d) => {
      return d.athlete === athlete && thisWeek >= new Date(d.week);
    });

    const average = round(Sum(vals.map((d) => d.value)) / numWeeks, 1);

    dataByAthlete[d.athlete].push({
      week: d.week,
      average,
      actual: d.value,
    });
  });

  const tableData: TableRow[] = [];
  Object.entries(dataByAthlete).forEach(([athlete, data]) => {
    const weekData = data.reduce<{ [week: string]: WeekData }>(
      (acc, d) => ({
        ...acc,
        [d.week]: { average: d.average, actual: d.actual },
      }),
      {}
    );
    const sortedData = [...data].sort((a, b) => {
      return new Date(a.week) < new Date(b.week) ? 1 : -1;
    });

    const start = 0;
    const end = params.get("month") ? sortedData.length - 1 : 1;
    const change = (
      sortedData[start].average - sortedData[end].average
    ).toFixed(1);

    tableData.push({ athlete, change, ...weekData });
  });
  tableData.sort((a, b) => (a.athlete > b.athlete ? 1 : -1));
  // debugger;
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
        columns={[
          "athlete",
          ...(!monthSummary ? ["change"] : []),
          ...weeks,
        ].map((k) => ({
          Header:
            k === "athlete" || k === "change"
              ? ""
              : k === params.get("week")
              ? "This week"
              : new Date(k).toLocaleDateString("en-gb", {
                  month: "short",
                  day: "numeric",
                }),
          id: k,
          accessor: (row: any) => {
            const showValue = monthSummary ? "actual" : "average";
            if (row[k][showValue] !== undefined) {
              return row[k][showValue];
            } else {
              return row[k];
            }
          },
        }))}
        data={tableData}
      />
    </div>
  );
};

export default RunsAverage;

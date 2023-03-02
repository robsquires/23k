import { useSearchParams, useRouteLoaderData } from "react-router-dom";
import { filterBeforeWeek, filterByMonth } from "../../../lib/filters";
import { isWeekData, Table, TableRow, WeekData } from "./Table";
import round from "lodash.round";
import {
  Athlete,
  Athletes,
  Measurement,
  MeasurementType,
} from "../../../lib/models";
import { Calendar } from "../../../lib/data";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
}

type DisplayOption = "average" | "actual";

export function getDisplayOption(params: URLSearchParams): DisplayOption {
  const value = params.get("display") || "average";
  if (value !== "average" && value !== "actual") {
    throw new Error("Unknown display option");
  }
  return value;
}

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
  const measurements = useRouteLoaderData("stats") as Measurement[];
  const [params] = useSearchParams();

  const displayOption = getDisplayOption(params);

  const weeks = Calendar.filter(
    (week) => new Date(week) <= new Date(params.get("week") || Date.now())
  ).sort((a, b) => {
    return new Date(a) > new Date(b) ? 1 : -1;
  });
  const thisWeek = weeks[weeks.length - 1];

  let runData = measurements.filter((d) => d.type === MeasurementType.RUN);
  // merge indivual entries into weeks
  const padded: Measurement[] = [];
  Athletes.forEach((athlete) => {
    weeks.forEach((week, i, arr) => {
      const prevWeek = arr[i - 1] || 0;
      const measurements = runData.filter(
        (d) =>
          d.athlete === athlete &&
          new Date(d.week) > new Date(prevWeek) &&
          new Date(d.week) <= new Date(week)
      );
      padded.push({
        type: MeasurementType.RUN,
        athlete,
        week,
        value: Sum(measurements.map((d) => d.value)),
      });
    });
  });

  const dataByAthlete: DataByAthlete = {};
  padded.forEach(({ week, athlete, value }) => {
    if (dataByAthlete[athlete] === undefined) {
      dataByAthlete[athlete] = [];
    }
    const thisWeek = new Date(week);
    const numWeeks = weeks.filter(
      (_week) => thisWeek >= new Date(_week)
    ).length;
    const vals = runData
      .filter((d) => {
        return athlete === d.athlete && thisWeek >= new Date(d.week);
      })
      .map((d) => d.value);

    const average = round(Sum(vals) / numWeeks, 1);

    dataByAthlete[athlete].push({
      week,
      average,
      actual: value,
    });
  });
  const tableData: TableRow[] = [];
  Object.entries(dataByAthlete).forEach(([athlete, data]) => {
    const weeks = data.filter(({ week }) => {
      return (
        new Date(week).getMonth() ===
        new Date(params.get("month") || week).getMonth()
      );
    });
    const oldest = params.get("month") ? 0 : weeks.length - 2;
    const recent = weeks.length - 1;
    const change = (weeks[recent].average - weeks[oldest].average).toFixed(1);

    const weekColumns = weeks.reduce<{ [week: string]: WeekData }>(
      (acc, d) => ({
        ...acc,
        [d.week]: { average: d.average, actual: d.actual },
      }),
      {}
    );
    tableData.push({ athlete, change, ...weekColumns });
  });

  tableData.sort((a, b) => (a.athlete > b.athlete ? 1 : -1));
  const weekColumns = Object.keys(tableData[0])
    .filter((k) => k !== "athlete" && k !== "change")
    .sort((a, b) => (new Date(a) < new Date(b) ? 1 : -1));
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
          ...(displayOption === "average" ? ["change"] : []),
          ...weekColumns,
        ].map((k: string) => ({
          Header:
            k === "athlete" || k === "change"
              ? ""
              : k === thisWeek
              ? "This week"
              : new Date(k).toLocaleDateString("en-gb", {
                  month: "short",
                  day: "numeric",
                }),
          id: k,
          accessor: (row: TableRow) => {
            const col = row[k];
            if (isWeekData(col)) {
              return col[displayOption];
            } else {
              return col;
            }
          },
        }))}
        data={tableData}
      />
    </div>
  );
};

export default RunsAverage;

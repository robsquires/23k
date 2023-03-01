import { useSearchParams, useRouteLoaderData } from "react-router-dom";
import {
  filterBeforeWeek,
  filterByDate,
  filterByMonth,
} from "../../../lib/filters";
import { isWeekData, Table, TableRow, WeekData } from "./Table";
import round from "lodash.round";
import { Athletes, Measurement, MeasurementType } from "../../../lib/models";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
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
  const monthSummary = !!params.get("month");

  const runData = measurements.filter(
    (d) =>
      d.type === MeasurementType.RUN &&
      filterByMonth(params, d.week) &&
      filterBeforeWeek(params, d.week)
  );

  const weeks = [...new Set(runData.map((d) => d.week).values())].sort(
    (a, b) => {
      return new Date(a) < new Date(b) ? 1 : -1;
    }
  );
  // pad out with zero weeks
  weeks.forEach((week) => {
    Athletes.forEach((athlete) => {
      const measurement = runData.find(
        (d) => d.week === week && d.athlete === athlete
      );
      if (!measurement) {
        runData.push({ type: MeasurementType.RUN, athlete, week, value: 0 });
      }
    });
  });

  const dataByAthlete: DataByAthlete = {};
  runData.forEach(({ week, athlete, value }) => {
    if (dataByAthlete[athlete] === undefined) {
      dataByAthlete[athlete] = [];
    }
    const thisWeek = new Date(week);
    const numWeeks = weeks.filter((week) => thisWeek >= new Date(week)).length;

    const vals = runData.filter((d) => {
      return athlete === d.athlete && thisWeek >= new Date(d.week);
    });

    const average = round(Sum(vals.map((d) => d.value)) / numWeeks, 1);

    dataByAthlete[athlete].push({
      week,
      average,
      actual: value,
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
        ].map((k: keyof TableRow) => ({
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
          accessor: (row: TableRow) => {
            const displayValue = monthSummary ? "actual" : "average";
            const col = row[k];
            if (isWeekData(col)) {
              return col[displayValue];
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

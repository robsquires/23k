import { Fragment } from "react";
import {
  useOutletContext,
  useSearchParams,
  useRouteLoaderData,
} from "react-router-dom";
import { Axis, LineSeries, XYChart } from "@visx/xychart";
import { LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";

import ChartBackground from "./ChartBackground";
import { Labels } from "./Labels";
import { WeightSummary } from "./WeightSummary";
import { filterByMonth, filterByWeek } from "../../../lib/filters";
import { Measurement, MeasurementType } from "../../../lib/models";

const backgroundColor = "#f97316";
const allColors = [
  "rgb(102 37 14)",
  "#7c2d12",
  "#9a3412",
  "#c2410c",
  "#fb923c",
  "#fdba74",
  "#ffedd5",
];

type ChartData = {
  x: string;
  y: number;
};

const accessors = {
  xAccessor: (d: ChartData) => d.x,
  yAccessor: (d: ChartData) => d.y,
};

const defaultMargin = { top: 155, right: 190, bottom: 50, left: 40 };

export type Props = {
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function Weight({ margin = defaultMargin }: Props) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  const measurements = useRouteLoaderData("stats") as Measurement[];
  const [params] = useSearchParams();

  const athletes: {
    [athlete: string]: ChartData[];
  } = {};

  measurements
    .filter(
      (d) =>
        d.type === MeasurementType.WEIGHT &&
        filterByWeek(params, d.week, 2) &&
        filterByMonth(params, d.week)
    )
    .forEach(({ athlete, week, value }) => {
      if (athletes[athlete] === undefined) {
        athletes[athlete] = [];
      }
      athletes[athlete].push({
        x: new Date(week).toLocaleDateString("en-gb", {
          month: "short",
          day: "numeric",
        }),
        y: value,
      });
    });

  // get list of athletes sorted by latest weight measurement (desc)
  const sortedAthletes = Object.keys(athletes).sort((a, b) =>
    athletes[a][athletes[a].length - 1].y >
    athletes[b][athletes[b].length - 1].y
      ? -1
      : 1
  );

  const colors: { [athlete: string]: string } = sortedAthletes.reduce(
    (acc, athlete, i) => ({
      ...acc,
      [athlete]: allColors[i],
    }),
    {}
  );
  const colorAccessor = (athlete: string) => colors[athlete];

  const colorScale = scaleOrdinal({
    domain: sortedAthletes,
    range: sortedAthletes.map((athlete) => colors[athlete]),
  });

  return (
    <div className="stats">
      <svg width={width} height={height} id="image">
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={backgroundColor}
        />
        <Text
          x={30}
          y={30}
          width={width}
          verticalAnchor="start"
          fill="white"
          style={{
            fontSize: "8rem",
            fontWeight: "900",
            letterSpacing: "-0.04em",
          }}
        >
          Put well built...
        </Text>
        <XYChart
          height={height}
          width={width}
          margin={margin}
          xScale={{ type: "band", paddingInner: 1 }}
          yScale={{
            type: "linear",
            domain: [76, 98],
            range: [yMax, margin.top],
            zero: false,
          }}
        >
          <ChartBackground />

          <Axis
            orientation="bottom"
            hideAxisLine
            hideTicks
            tickLabelProps={(_data, i, arr) => {
              const isFirst = i === 0;
              const isLast = i === arr.length - 1;
              return {
                y: 25,
                fill: "white",
                fontFamily: "Avenir",
                fontSize: "1.2rem",
                textAnchor: isFirst ? "start" : isLast ? "end" : "middle",
              };
            }}
          />
          {Object.keys(athletes).map((athlete) => {
            return (
              <Fragment key={athlete}>
                <LineSeries
                  dataKey={athlete}
                  data={athletes[athlete]}
                  style={{
                    strokeWidth: 6,
                  }}
                  colorAccessor={colorAccessor}
                  {...accessors}
                />
                <Labels dataKey={athlete} colors={colors} />
              </Fragment>
            );
          })}
          <WeightSummary x={xMax + margin.right - 20} colors={colors} />
        </XYChart>
      </svg>
      <LegendOrdinal
        shape="circle"
        style={{
          position: "relative",
          left: "80px",
          bottom: "100px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          color: "white",
          fontSize: "1.2em",
        }}
        scale={colorScale}
        direction="row"
        labelMargin="0 15px 0 0"
      />
    </div>
  );
}

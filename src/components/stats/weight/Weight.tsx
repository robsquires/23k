import { Fragment } from "react";
import {
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import { Axis, LineSeries, XYChart } from "@visx/xychart";
import { LegendOrdinal } from "@visx/legend";
import { scaleOrdinal, scaleLinear, scaleBand } from "@visx/scale";
import { Text } from "@visx/text";

import ChartBackground from "./ChartBackground";
import { Labels } from "./Labels";
import { WeightSummary } from "./WeightSummary";

const backgroundColor = "#f97316";
const colors: { [athlete: string]: string } = {
  Adam: "#c2410c",
  Paul: "#9a3412",
  Rich: "#fdba74",
  Rob: "#ffedd5",
  Russ: "rgb(102 37 14)",
  Scott: "#7c2d12",
  TJ: "#fb923c",
};
type Measurement = {
  type: string;
  athlete: string;
  value: number;
  week: string;
};
type Data = {
  Measurement: Measurement[];
};

type ChartData = {
  x: string;
  y: number;
};

const accessors = {
  xAccessor: (d: ChartData) => d.x,
  yAccessor: (d: ChartData) => d.y,
  colorAccessor: (athlete: string) => colors[athlete],
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

  const { Measurement } = useRouteLoaderData("stats") as Data;
  const params = useParams();

  const athletes: {
    [athlete: string]: ChartData[];
  } = {};

  Measurement.filter(
    (d) =>
      d.type === "WEIGHT" && new Date(d.week) <= new Date(params.week || "")
  ).forEach((d) => {
    if (athletes[d.athlete] === undefined) {
      athletes[d.athlete] = [];
    }
    athletes[d.athlete].push({
      x: new Date(d.week).toLocaleDateString("en-gb", {
        month: "short",
        day: "numeric",
      }),
      y: d.value,
    });
  });

  const sortedAthletes = Object.keys(athletes).sort((a, b) =>
    athletes[a][athletes[a].length - 1].y >
    athletes[b][athletes[b].length - 1].y
      ? -1
      : 1
  );

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
                  {...accessors}
                />
                <Labels dataKey={athlete} colors={colors} />
              </Fragment>
            );
          })}
          <WeightSummary x={xMax + margin.right / 2} colors={colors} />
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

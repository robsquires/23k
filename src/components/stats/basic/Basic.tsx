import { BarRounded } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import {
  useOutletContext,
  useSearchParams,
  useRouteLoaderData,
} from "react-router-dom";
import { filterByDate } from "../../../lib/filters";
import {
  Athletes,
  MeasurementType,
  Measurement,
  isExerciseType,
} from "../../../lib/models";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
}

type SummarisedMeasurement = {
  athlete: string;
  value: number;
};

const defaultMargin = { top: 20, right: 20, bottom: 0, left: 120 };

const bannerHeight = 175;
// accessors
const getAthlete = (d: SummarisedMeasurement) => d.athlete;
const getValue = (d: SummarisedMeasurement) => d.value;

function getExerciseType(
  params: URLSearchParams,
  fallback: MeasurementType
): MeasurementType {
  const typeValue = (params.get("type") || fallback).toUpperCase();
  if (isExerciseType(typeValue)) {
    return MeasurementType[typeValue];
  }
  throw new Error("Unknown exercise type");
}

function getBackgroundColor(exerciseType: MeasurementType) {
  switch (exerciseType) {
    case MeasurementType.RUN:
      return "rgb(41, 191, 18)";
    case MeasurementType.CYCLE:
      return "#FFD700";
    case MeasurementType.SWIM:
      return "#0099FF";
  }
}

function getTitle(exerciseType: MeasurementType) {
  switch (exerciseType) {
    case MeasurementType.RUN:
      return "Run far, die old";
    case MeasurementType.CYCLE:
      return "Chapeau!";
    case MeasurementType.SWIM:
      return "Latfest";
  }
}

export default function Basic({ margin = defaultMargin }) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();

  const measurements = useRouteLoaderData("stats") as Measurement[];
  let [params] = useSearchParams();
  const exerciseType = getExerciseType(params, MeasurementType.RUN);
  const backgroundColor = getBackgroundColor(exerciseType);

  const filteredMeasurements = measurements.filter(
    (d: Measurement) => d.type === exerciseType && filterByDate(params, d.week)
  );
  const chartData: SummarisedMeasurement[] = Athletes.map((athlete) => ({
    athlete,
    value: Sum(
      filteredMeasurements
        .filter((d) => d.athlete === athlete)
        .map((d) => d.value)
    ),
  }))
    .filter(({ value }) => value > 0)
    .sort((a, b) => (a.value < b.value ? 1 : -1));

  const topAthlete = chartData[0].athlete;

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom - bannerHeight;

  const xScale = scaleLinear<number>({
    range: [xMax, 0],
    round: true,
    domain: [0, Math.max(...chartData.map(getValue))],
  });

  const yScale = scaleBand<string>({
    range: [0, yMax],
    round: true,
    domain: chartData.map(getAthlete),
    padding: 0.2,
  });

  const AthleteScale = scaleBand({
    range: [0, yMax],
    domain: chartData.map(getAthlete),
    padding: 0.2,
  });

  return (
    <div className="stats" style={{ backgroundColor }}>
      <div
        className="stats-title"
        style={{
          color: "white",
          height: bannerHeight,
        }}
      >
        <img
          className="emoji"
          src={`/emojis/${exerciseType.toLocaleLowerCase()}.png`}
        ></img>
        {getTitle(exerciseType)}
      </div>
      <svg
        width={width}
        height={height - bannerHeight}
        className="stats"
        id="image"
        style={{ backgroundColor: "transparent" }}
      >
        <rect
          x={0}
          y={0}
          width={width}
          height={height - bannerHeight}
          fill={backgroundColor}
        />
        <Group left={margin.left}>
          {chartData.map(({ athlete, value }) => {
            const barHeight = yScale.bandwidth();
            const barWidth = xMax - (xScale(value) ?? 0);
            const barY = yScale(athlete) || 0;
            const valueStr =
              exerciseType === MeasurementType.SWIM
                ? `${new Intl.NumberFormat("en-GB", {
                    maximumFractionDigits: 0,
                  }).format(value)} m`
                : `${value.toFixed(1)} km`;
            // magic number based on fixed font size below
            const showExternal = barWidth < valueStr.length * 24;
            return (
              <Group key={athlete}>
                <BarRounded
                  all
                  radius={10}
                  key={`bar-${athlete}`}
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="white"
                  opacity={athlete === topAthlete ? "1" : "0.5"}
                />
                <Text
                  y={barY + barHeight / 2}
                  x={10 + (showExternal ? barWidth : 0)}
                  height={barHeight}
                  fill={showExternal ? "white" : backgroundColor}
                  dominantBaseline="central"
                  style={{
                    fontSize: "40px",
                    fontWeight: "800",
                    letterSpacing: "-0.05em",
                    backgroundColor: "red",
                  }}
                >
                  {valueStr}
                </Text>
              </Group>
            );
          })}
          <AxisLeft
            scale={AthleteScale}
            hideAxisLine
            hideTicks
            tickLabelProps={() => ({
              fill: "white",
              fontSize: "1.5rem",
              textAnchor: "end",
              dy: "0.4em",
              dx: "-0.3em",
              style: {
                color: "white",
                fontFamily: "Helvetica Neue",
                fontSize: "2rem",
                fontWeight: "800",
                letterSpacing: "-0.05em",
              },
            })}
          />
        </Group>
      </svg>
    </div>
  );
}

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

type Measurement = {
  type: string;
  athlete: string;
  value: number;
  week: string;
};
type Data = {
  Measurement: Measurement[];
};

type SummarisedMeasurement = {
  athlete: string;
  value: number;
};

const defaultMargin = { top: 20, right: 20, bottom: 0, left: 120 };
const backgroundColor = "rgb(44, 110, 252)";
const bannerHeight = 175;
// accessors
const getAthlete = (d: SummarisedMeasurement) => d.athlete;
const getValue = (d: SummarisedMeasurement) => d.value;

export default function Runs({ margin = defaultMargin }) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();

  const { Measurement } = useRouteLoaderData("stats") as Data;
  let [params] = useSearchParams();

  const athletes: {
    [athlete: string]: SummarisedMeasurement;
  } = {};

  Measurement.filter(
    (d: Measurement) => d.type === "RUN" && filterByDate(params, d.week)
  ).forEach((d) => {
    if (athletes[d.athlete] === undefined) {
      athletes[d.athlete] = {
        athlete: d.athlete,
        value: 0,
      };
    }
    console.log(athletes[d.athlete].value, d.value);
    athletes[d.athlete].value += d.value;
    console.log(athletes[d.athlete].value);
  });

  const data = Object.entries(athletes)
    .map(([_athlete, data]) => data)
    .sort((a, b) => (a.athlete > b.athlete ? 1 : -1));

  const topAthlete = [...data].sort((a, b) => (a.value < b.value ? 1 : -1))[0]
    .athlete;

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom - bannerHeight;

  const xScale = scaleLinear<number>({
    range: [xMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(getValue))],
  });

  const yScale = scaleBand<string>({
    range: [0, yMax],
    round: true,
    domain: data.map(getAthlete),
    padding: 0.2,
  });

  const AthleteScale = scaleBand({
    range: [0, yMax],
    domain: data.map(getAthlete),
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
        Run far, die old
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
          {data.map(({ athlete, value }) => {
            const barHeight = yScale.bandwidth();
            const barWidth = xMax - (xScale(value) ?? 0);
            const barY = yScale(athlete) || 0;
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
                  y={barY + barHeight / 1.4}
                  x={10}
                  fill={backgroundColor}
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {`${value.toFixed(1)} km `}
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

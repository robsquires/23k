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
import { Athlete, Measurement, MeasurementType } from "../../../lib/models";

const teams: { [athlete: string]: string } = {
  Rob: "Jobsy & Ivesy",
  Paul: "Jobsy & Ivesy",
  Adam: "Frosted Tips",
  Rich: "Frosted Tips",
  Russ: "Pace N' Power",
  Scott: "Pace N' Power",
  TJ: "Pace N' Power",
};

type TeamData = {
  team: string;
  average: number;
  numberAthletes: number;
  sum: number;
};

const defaultMargin = { top: 20, right: 30, bottom: 0, left: 250 };
const backgroundColor = "rgb(239, 62, 86)";
const bannerHeight = 175;
// accessors
const getTeam = (d: TeamData) => d.team;
const getValue = (d: TeamData) => d.average;
const descBy = (key: keyof TeamData) => (a: TeamData, b: TeamData) =>
  a[key] < b[key] ? 1 : -1;

export default function CaloriesTeam({ margin = defaultMargin }) {
  // Data

  const measurements = useRouteLoaderData("stats") as Measurement[];
  const [params] = useSearchParams();

  const teamData: { [teamName: string]: TeamData } = {};
  measurements
    .filter(
      (d: Measurement) =>
        d.type === MeasurementType.CALORIES && filterByDate(params, d.week)
    )
    .forEach((d) => {
      const team = teams[d.athlete];
      if (!teamData[team]) {
        teamData[team] = {
          team,
          numberAthletes: Object.values(teams).filter((name) => name === team)
            .length,
          sum: 0,
          average: 0,
        };
      }
      teamData[team].sum += d.value;
      // re-calculate running average each time
      teamData[team].average =
        teamData[team].sum / teamData[team].numberAthletes;
    });

  const chartData = Object.values(teamData).sort(descBy("average"));
  const topTeam = chartData[0]?.team;

  // Dimensions and scales
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();

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
    domain: chartData.map(getTeam),
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
        Burn, Baby Burn
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
          {chartData.map(({ team, average }) => {
            const barHeight = yScale.bandwidth();
            const barWidth = xMax - (xScale(average) ?? 0);
            const barY = yScale(team) || 0;
            return (
              <Group key={team}>
                <BarRounded
                  all
                  radius={10}
                  key={`bar-${team}`}
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="white"
                  opacity={team === topTeam ? "1" : "0.6"}
                />
                <Text
                  y={barY + barHeight / 2}
                  x={15}
                  fill={backgroundColor}
                  dominantBaseline="central"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {`${new Intl.NumberFormat("en-GB", {
                    maximumFractionDigits: 0,
                  }).format(average)} cals `}
                </Text>
              </Group>
            );
          })}
          <AxisLeft
            scale={yScale}
            hideAxisLine
            hideTicks
            tickLabelProps={() => ({
              fill: "white",
              textAnchor: "end",
              dy: "0.4em",
              dx: "-0.3em",
              style: {
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

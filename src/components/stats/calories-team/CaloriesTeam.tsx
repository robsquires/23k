import { BarRounded } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import { useOutletContext, useRouteLoaderData } from "react-router-dom";

type Measurement = {
  type: string;
  athlete: string;
  value: number;
  week: string;
};
type Data = {
  Measurement: Measurement[];
};

const defaultMargin = { top: 20, right: 30, bottom: 0, left: 250 };
const backgroundColor = "rgb(239, 62, 86)";
const bannerHeight = 175;
// accessors
const getTeam = (d: any) => d.team;
const getValue = (d: any) => d.value;

export default function CaloriesTeam({ margin = defaultMargin }) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();

  const { Measurement } = useRouteLoaderData("stats") as Data;

  const teams: {
    [teamName: string]: string;
  } = {
    Rob: "Jobsy & Ivesy",
    Paul: "Jobsy & Ivesy",
    Adam: "Frosted Tips",
    Rich: "Frosted Tips",
    Russ: "Pace N' Power",
    Scott: "Pace N' Power",
    TJ: "Pace N' Power",
  };
  //   const data = [];
  const teamData: {
    [teamName: string]: { team: string; value: number; athletes: any[] };
  } = {};
  Measurement.filter(
    (d: Measurement) => d.type === "CALORIES" && d.week === "2023-02-24"
  ).forEach((d) => {
    const team = teams[d.athlete];
    if (!teamData[team]) {
      teamData[team] = {
        team,
        athletes: [],
        value: 0,
      };
    }
    teamData[team].athletes.push(d);
    teamData[team].value =
      (teamData[team].value + d.value) / teamData[team].athletes.length;
  });

  const data = Object.entries(teamData).map(([_key, data]) => data);

  const topTeam = [...data].sort((a, b) => (a.value < b.value ? 1 : -1))[0]
    ?.team;

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
    domain: data.map(getTeam),
    padding: 0.2,
  });

  const AthleteScale = scaleBand({
    range: [0, yMax],
    domain: data.map(getTeam),
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
          {data.map(({ team, value }) => {
            const barHeight = yScale.bandwidth();
            const barWidth = xMax - (xScale(value) ?? 0);
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
                  y={barY + barHeight / 1.6}
                  x={15}
                  fill={backgroundColor}
                  style={{
                    fontFamily: "Avenir",
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {`${new Intl.NumberFormat("en-GB", {
                    maximumFractionDigits: 0,
                  }).format(value)} cals `}
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
                fontFamily: "Avenir",
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

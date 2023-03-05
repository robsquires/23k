import {
  useOutletContext,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import { filterByDate } from "../../../lib/filters";
import "./calories.css";
import { Measurement, Athletes } from "../../../lib/models";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
}

function calcFontSize(x: number) {
  return x <= 30 ? 8 : 10.9111 - 1.192 * Math.log(3.5911 * x - 140.987);
}

const sizeMapping = [
  [4, 350],
  [5, 280],
  [14, 200],
  [16, 175],
  [30, 140],
  [56, 100],
  [120, 70],
  [200, 56],
  [252, 50],
  [385, 40],
  [520, 35],
  [800, 28],
  [1008, 25],
  [1610, 20],
  [3300, 14],
  [6440, 10],
];
function getSize(count: number) {
  return (sizeMapping.find(([maxCount]) => {
    console.log(count, maxCount);
    return count < maxCount;
  }) || ["default", 30])[1];
}

function calcNumberBurgers(calories: number) {
  return Math.round(calories / 550);
}

const colors = [
  "#ef4444",
  "#f97316",
  "#facc15",
  "#a3e635",
  "#38bdf8",
  "#7c3aed",
  "#d946ef",
];

export default function Calories() {
  const measurements = useRouteLoaderData("stats") as Measurement[];
  const [params] = useSearchParams();

  const calorieMeasurements = measurements.filter(
    (d: any) => d.type === "CALORIES" && filterByDate(params, d.week)
  );

  const data = Athletes.map((athlete) => ({
    athlete,
    sum: Sum(
      calorieMeasurements
        .filter((d) => d.athlete === athlete)
        .map((a) => a.value)
    ),
  })).sort((a, b) => (a.sum < b.sum ? 1 : -1));
  const totalBurgers = calcNumberBurgers(Sum(data.map(({ sum }) => sum)));
  const emojiSize = getSize(totalBurgers);
  return (
    <div className="stats">
      <div
        className="stats-title"
        style={{
          height: "175px",
          color: "#16a34a",
        }}
      >
        Burger Kings
      </div>
      <table>
        <tbody>
          <tr>
            {data.map(({ athlete, sum }, i) => {
              return (
                <td
                  key={athlete}
                  style={{
                    color: colors[i],
                  }}
                >
                  <span className="athlete">{calcNumberBurgers(sum)}</span>
                  <br />
                  {new Intl.NumberFormat("en-IN").format(sum)} cals
                </td>
              );
            })}
          </tr>
          <tr>
            {data.map(({ athlete }, i) => (
              <td
                key={athlete}
                style={{
                  color: colors[i],
                }}
              >
                {athlete}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div
        className="burgers"
        style={{
          lineHeight: 0,
        }}
      >
        {data.map((athleteData, i) => {
          return [...new Array(calcNumberBurgers(athleteData.sum))].map(
            (_, k) => (
              <img
                style={{
                  backgroundColor: colors[i],
                  width: `${emojiSize}px`,
                  height: `${emojiSize}px`,
                }}
                key={k}
                src="/emojis/burger.png"
              />
            )
          );
        })}
      </div>
    </div>
  );
}

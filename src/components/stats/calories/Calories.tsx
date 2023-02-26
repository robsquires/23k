import { useOutletContext, useLoaderData } from "react-router-dom";
import "./calories.css";

function Sum(arr: number[]) {
  return arr.reduce((acc, value) => acc + value, 0);
}

function calcFontSize(x: number) {
  return 6.983 - 0.742 * Math.log(1.84 * x - 203.7);
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

type Data = {
  Measurement: {
    type: string;
    athlete: string;
    value: number;
  }[];
};

export default function Calories(props: any) {
  const { width, height } = useOutletContext<{
    width: number;
    height: number;
  }>();

  const data = useLoaderData() as Data;

  const athletes: {
    [key: string]: {
      calories: number[];
      sum: number;
    };
  } = {};

  data.Measurement.filter((d: any) => d.type === "CALORIES").forEach((d) => {
    if (athletes[d.athlete] === undefined) {
      athletes[d.athlete] = {
        calories: [],
        sum: 0,
      };
    }
    athletes[d.athlete].calories.push(d.value);
    athletes[d.athlete].sum = Sum(athletes[d.athlete].calories);
  });

  const flatData = Object.entries(athletes)
    .map(([athlete, { sum }]) => ({
      athlete,
      sum,
    }))
    .sort((a, b) => (a.sum < b.sum ? 1 : -1));

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
            {flatData.map(({ athlete, sum }, i) => {
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
            {flatData.map(({ athlete }, i) => (
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
          fontSize: `${calcFontSize(
            calcNumberBurgers(Sum(flatData.map(({ sum }) => sum)))
          )}vw`,
        }}
      >
        {flatData.map(({ athlete, sum }, i) => {
          return (
            <span
              key={athlete}
              style={{
                backgroundColor: colors[i],
              }}
            >
              {new Array(calcNumberBurgers(sum)).fill("🍔").join("")}
            </span>
          );
        })}
      </div>
    </div>
  );
}

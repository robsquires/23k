import { NumberLike } from "@visx/scale";
import { DataContext } from "@visx/xychart";
import { useContext } from "react";
import { Text } from "@visx/text";
import { useAdjustedY } from "./use-adjusted-y";
import round from "lodash.round";

export const WeightSummary = ({ x, colors }: { x: number; colors: any }) => {
  const { xScale, yScale, dataRegistry } = useContext(DataContext);
  const lookupY = useAdjustedY();

  if (!dataRegistry || !yScale || !xScale) {
    return <></>;
  }

  return (
    <>
      {dataRegistry.keys().map((dataKey) => {
        const entry = dataRegistry.get(dataKey);
        const first = entry.data[0];
        const last = entry.data[entry.data.length - 1];
        const value = round(entry.yAccessor(last) - entry.yAccessor(first), 1);
        const isNegative = value < 0;
        const y = lookupY(dataKey, entry.data.length - 1) || 0;

        return (
          <Text
            key={dataKey}
            x={x}
            y={y}
            textAnchor="end"
            verticalAnchor="middle"
            fill={colors[dataKey]}
            style={{
              fontSize: "1.4em",
              fontWeight: "600",
            }}
          >
            {`${isNegative ? "-" : "+"}${Math.abs(value).toFixed(1)} kg`}
          </Text>
        );
      })}
    </>
  );
};

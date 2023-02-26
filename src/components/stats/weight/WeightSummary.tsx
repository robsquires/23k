import { NumberLike } from "@visx/scale";
import { DataContext } from "@visx/xychart";
import { useContext } from "react";
import { Text } from "@visx/text";
import { useAdjustedY } from "./use-adjusted-y";

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
        const value = (entry.yAccessor(last) - entry.yAccessor(first)).toFixed(
          1
        );

        const y = lookupY(dataKey, entry.data.length - 1) || 0;

        return (
          <Text
            key={dataKey}
            x={x}
            y={y}
            textAnchor="start"
            verticalAnchor="middle"
            fill={colors[dataKey]}
            style={{
              fontSize: "1.4em",
              fontWeight: "600",
            }}
          >
            {`${value} kg`}
          </Text>
        );
      })}
    </>
  );
};

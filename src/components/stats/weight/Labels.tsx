import { DataContext } from "@visx/xychart";
import { useContext } from "react";
import { Text } from "@visx/text";
import { useAdjustedY } from "./use-adjusted-y";

export const Labels = ({
  dataKey,
  colors,
}: {
  dataKey: string;
  colors: any;
}) => {
  const { xScale, yScale, dataRegistry } = useContext(DataContext);
  const lookupAdjustedY = useAdjustedY();

  if (!dataRegistry || !xScale || !yScale) {
    return <></>;
  }
  const entry = dataRegistry.get(dataKey);

  return (
    <>
      {entry.data.map((d, i) => {
        const first = i === 0;
        const last = i === entry.data.length - 1;
        // only render first and last labels
        if (!first && !last) {
          return null;
        }

        const x = xScale(entry.xAccessor(d))?.valueOf() || 0;
        const y = lookupAdjustedY(dataKey, i) || 0;

        return (
          <Text
            key={`${d}-${i}`}
            x={x + (first ? 52 : -52)}
            y={y}
            textAnchor={first ? "end" : "start"}
            verticalAnchor="middle"
            fill={colors[dataKey]}
            style={{
              fontSize: "1.4rem",
              fontWeight: "600",
            }}
          >
            {d.y.toFixed(1)}
          </Text>
        );
      })}
    </>
  );
};

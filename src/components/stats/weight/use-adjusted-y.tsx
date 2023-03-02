import { DataContext } from "@visx/xychart";
import { useContext } from "react";

export function useAdjustedY() {
  const { yScale, dataRegistry } = useContext(DataContext);
  if (!dataRegistry || !yScale) {
    return () => null;
  }

  return (dataKey: string, column: "first" | "last") =>
    dataRegistry
      .keys()
      .map((dataKey) => {
        const entry = dataRegistry.get(dataKey);
        const datum =
          entry.data[column === "first" ? 0 : entry.data.length - 1];
        return {
          y: yScale(entry.yAccessor(datum))?.valueOf() || 0,
          dataKey,
        };
      })
      .sort((a, b) => (a.y > b.y ? 1 : -1))
      .map(({ y, dataKey }, idx, arr) => {
        // by default adjust so label is above the line
        // flip below the line if value is close to previous entry
        const prevY = arr[idx - 1]?.y || 0;
        const diffY = y - prevY;
        return { dataKey, y: y + (diffY > 30 ? -20 : 20) };
      })
      .find((d) => d.dataKey === dataKey)?.y || null;
}

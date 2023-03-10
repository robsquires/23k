import React, { useContext } from "react";
import { PatternLines } from "@visx/pattern";
import { DataContext } from "@visx/xychart";

const patternId = "xy-chart-pattern";

export default function CustomChartBackground() {
  const { margin, innerWidth, innerHeight } = useContext(DataContext);
  // early return values not available in context
  if (margin == null || innerWidth == null || innerHeight == null) return null;
  return (
    <>
      <PatternLines
        id={patternId}
        width={16}
        height={16}
        orientation={["diagonal"]}
        stroke="#fb923c"
        strokeWidth={1}
      />
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        fill={`url(#${patternId})`}
      />
    </>
  );
}

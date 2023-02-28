import { useTable } from "react-table";
import "./runs-average.css";

export type WeekData = {
  actual: number;
  average: number;
};

export type TableRow = {
  athlete: string;
  change: string;
  // Need "| string" here since this fallback index type needs to
  // be compatible with all other string indexes
  // requires extra type check when reading/writing the 'week' indexes
  [week: string]: WeekData | string;
};

function isWeekData(data: WeekData | string): data is WeekData {
  return !(data instanceof String);
}

//@todo work out how to pass column type
export function Table({ columns, data }: { columns: any; data: TableRow[] }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                const classes = [];
                const data = cell.row.original[cell.column.id];
                console.log(data, isWeekData(data));
                if (cell.column.id === "change") {
                  classes.push("change");
                  classes.push(cell.value >= 0 ? "positive" : "negative");
                } else if (cell.column.id !== "athlete") {
                  classes.push("data");
                  classes.push(
                    isWeekData(data) && data.actual === 0
                      ? "zero"
                      : cell.value >= 23
                      ? "high"
                      : cell.value >= 16
                      ? "med"
                      : "low"
                  );
                }
                return (
                  <td {...cell.getCellProps()} className={classes.join(" ")}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

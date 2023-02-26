import React from "react";
import { useTable } from "react-table";
import "./runs-average.css";

type TableData = {
  athlete: string;
  change: string;
}[];

//@todo work out how to pass column type
export function Table({ columns, data }: { columns: any; data: TableData }) {
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

                if (cell.column.id === "change") {
                  classes.push("change");
                  classes.push(cell.value >= 0 ? "positive" : "negative");
                } else if (cell.column.id !== "athlete") {
                  classes.push("data");
                  classes.push(
                    cell.value >= 23
                      ? "high"
                      : cell.value >= 16
                      ? "med"
                      : cell.value === undefined
                      ? "zero"
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

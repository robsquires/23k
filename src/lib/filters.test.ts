import { filterByDate } from "./filters";
describe("date filters", () => {
  test("filter by year", () => {
    expect(
      filterByDate(new URLSearchParams("year=2023"), "2023-01-01")
    ).toBeTruthy();
    expect(
      filterByDate(new URLSearchParams("year=2022"), "2023-01-01")
    ).toBeFalsy();
  });
  test("filter by month", () => {
    expect(
      filterByDate(new URLSearchParams("month=2023-01"), "2023-01-01")
    ).toBeTruthy();
    expect(
      filterByDate(new URLSearchParams("month=2023-02"), "2023-01-01")
    ).toBeFalsy();
  });

  test("filter by week", () => {
    expect(
      filterByDate(new URLSearchParams("week=2023-01-01"), "2023-01-01")
    ).toBeTruthy();
    expect(
      filterByDate(new URLSearchParams("week=2023-01-02"), "2023-01-01")
    ).toBeFalsy();
  });
});
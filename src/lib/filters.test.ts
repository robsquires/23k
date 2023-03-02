import {
  filterBeforeWeek,
  filterByWeek,
  filterByYear,
  filterByMonth,
} from "./filters";
describe("date filters", () => {
  test("filter by year", () => {
    expect(
      filterByYear(new URLSearchParams("year=2023"), "2023-01-01")
    ).toBeTruthy();
    expect(
      filterByYear(new URLSearchParams("year=2022"), "2023-01-01")
    ).toBeFalsy();
  });
  test("filter by month", () => {
    expect(
      filterByMonth(new URLSearchParams("month=2023-01"), "2023-01-01")
    ).toBeTruthy();
    expect(
      filterByMonth(new URLSearchParams("month=2023-02"), "2023-01-01")
    ).toBeFalsy();
  });

  test("filter by week", () => {
    expect(
      filterByWeek(new URLSearchParams("week=2023-02-24"), "2023-02-24")
    ).toBeTruthy();
    expect(
      filterByWeek(new URLSearchParams("week=2023-02-24"), "2023-02-25")
    ).toBeFalsy();
  });

  test("filter by calendar week", () => {
    expect(
      filterByWeek(new URLSearchParams("week=2023-03-03"), "2023-02-28")
    ).toBeTruthy();
    expect(
      filterByWeek(new URLSearchParams("week=2023-03-03"), "2023-02-24")
    ).toBeFalsy();
  });

  test("including preceeding weeks in filter", () => {
    expect(
      filterByWeek(new URLSearchParams("week=2023-03-03"), "2023-02-28")
    ).toBeTruthy();
    expect(
      filterByWeek(new URLSearchParams("week=2023-03-03"), "2023-02-24", 2)
    ).toBeTruthy();
  });

  test("filterBeforeWeek", () => {
    expect(
      filterBeforeWeek(new URLSearchParams("week=2023-01-17"), "2023-01-10")
    ).toBeTruthy();

    expect(
      filterBeforeWeek(new URLSearchParams("week=2023-01-17"), "2023-01-17")
    ).toBeTruthy();

    expect(
      filterBeforeWeek(new URLSearchParams("week=2023-01-17"), "2023-01-18")
    ).toBeFalsy();
  });
});

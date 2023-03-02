import { Calendar } from "./data";

export function filterByDate(params: URLSearchParams, week: string) {
  return (
    filterByYear(params, week) &&
    filterByMonth(params, week) &&
    filterByWeek(params, week)
  );
}

export function filterByMonth(params: URLSearchParams, week: string) {
  const param = params.get("month");
  return param
    ? new Date(week).getMonth() === new Date(param).getMonth()
    : true;
}

export function filterByYear(params: URLSearchParams, week: string) {
  const param = params.get("year");
  return param
    ? new Date(week).getFullYear() === new Date(param).getFullYear()
    : true;
}

export function filterByWeek(
  params: URLSearchParams,
  week: string,
  leadingWeeks = 1
) {
  const param = params.get("week");
  if (!param) {
    return true;
  }
  const [start, end] = Calendar.filter(
    (week, i, arr) => week === param || arr[i + leadingWeeks] === param
  );

  return new Date(start) < new Date(week) && new Date(week) <= new Date(end);
}

export function filterBeforeWeek(params: URLSearchParams, week: string) {
  const param = params.get("week");
  return param ? new Date(param) >= new Date(week) : true;
}

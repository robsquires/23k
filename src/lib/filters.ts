export function filterByDate(params: URLSearchParams, week: string) {
  const yearParam = params.get("year");
  const monthParam = params.get("month");
  const weekParam = params.get("week");
  if (yearParam) {
    return new Date(week).getFullYear() === new Date(yearParam).getFullYear();
  } else if (monthParam) {
    return new Date(week).getMonth() === new Date(monthParam).getMonth();
  } else if (weekParam) {
    return week === weekParam;
  }
  return true;
}

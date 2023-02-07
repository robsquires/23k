const endpoint = "https://allowing-man-96.hasura.app/v1/graphql";

export enum QUERY {
  INSERT_MEASUREMENTS = `
        mutation saveMeasurements($inserts: [Measurement_insert_input!]!, $updates: [Measurement_updates!]!) {
            insert_Measurement(objects: $inserts) {
                returning {
                    id, type, value, week, athlete
                }
            }
            update_Measurement_many(updates: $updates) {
              returning {
                  id, type, value, week, athlete
              }
          }
        }
    `,
  MEASUREMENTS_FOR_WEEK = `
    query measurementsForWeek($athlete: String, $week: date) {
      Measurement(where: {_and: {week: {_eq: $week}}, athlete: {_eq: $athlete }}) {
        athlete
        id
        type
        value
        week
      }
    }
  `,
}

export async function request(query: QUERY, variables: object) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret":
        "55tr6VtelVjUwnsP4uoHAd3a44slHC3TCDzJ8AAbgDfGDkC6pksZAD58UUmjhHME",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status >= 400) {
    throw new Error("Error saving data");
  }

  const data = await response.json();

  if (!!data.errors) {
    console.error(data.errors);
    throw new Error("Error saving data");
  }
  return data.data;
}

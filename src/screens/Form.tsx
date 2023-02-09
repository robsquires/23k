import React from "react";
import { request, QUERY } from "../lib/graphql";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button, Share } from "../components/Button";
import { Input } from "../components/Input";
import * as Emoji from "../lib/emoji";

enum TYPE {
  SWIM = "SWIM",
  CYCLE = "CYCLE",
  RUN = "RUN",
  CALORIES = "CALORIES",
  WEIGHT = "WEIGHT",
}
const TYPES = [TYPE.SWIM, TYPE.CYCLE, TYPE.RUN, TYPE.CALORIES, TYPE.WEIGHT];

export type MeasurementData = {
  type: TYPE;
  value: number;
  id?: number;
};

type Props = {
  athlete: string;
  week: string;
};

interface FormElements extends HTMLFormControlsCollection {
  run: HTMLInputElement;
  calories: HTMLInputElement;
  weight: HTMLInputElement;
}

interface MyFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function Form({ athlete, week }: Props) {
  const queryClient = useQueryClient();

  const saveMeasurements = useMutation({
    mutationFn: ({
      inserts,
      updates,
    }: {
      inserts: MeasurementData[];
      updates: MeasurementData[];
    }) => {
      return request(QUERY.INSERT_MEASUREMENTS, {
        inserts,
        updates: updates.map(({ id, value }) => ({
          where: { id: { _eq: id } },
          _set: { value },
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(week);
    },
  });
  const measurementsResult = useQuery({
    queryKey: week,
    queryFn: () =>
      request(QUERY.MEASUREMENTS_FOR_WEEK, {
        athlete,
        week,
      }),
  });

  const currentMeasurements: MeasurementData[] = measurementsResult.data
    ? measurementsResult.data.Measurement
    : [];

  const byType = (type: TYPE) => (measurement: any) =>
    measurement.type === type;

  function onFormSubmit(e: React.FormEvent<MyFormElement>) {
    e.preventDefault();
    const data = TYPES.map((type) => ({
      type,
      value: Number(e.currentTarget[type]?.value),
      athlete,
      week,
      id: currentMeasurements.find(byType(type))?.id,
    })).filter(({ value, type }) => {
      const currentValue = currentMeasurements.find(byType(type))?.value;
      // always save if there's a current value
      // otherwise on save if a value has been entered
      return (
        (currentValue && currentValue !== value) || (!currentValue && value > 0)
      );
    });

    if (data.length === 0) {
      return;
    }

    saveMeasurements.mutate({
      inserts: data.filter(({ id }) => !id),
      updates: data.filter(({ id }) => !!id),
    });
  }

  const showShare =
    currentMeasurements.find(byType(TYPE.CALORIES))?.id &&
    currentMeasurements.find(byType(TYPE.WEIGHT))?.id;

  return (
    <div className="flex flex-col space-y-5">
      <form onSubmit={onFormSubmit} className="flex flex-col space-y-5">
        <Input
          placeholderText={Emoji.forType(TYPE.SWIM)}
          name="swim"
          id={TYPE.SWIM}
          units="m"
          value={currentMeasurements.find(byType(TYPE.SWIM))?.value}
        />
        <Input
          placeholderText={Emoji.forType(TYPE.CYCLE)}
          name="cycle"
          id={TYPE.CYCLE}
          units="km"
          value={currentMeasurements.find(byType(TYPE.CYCLE))?.value}
        />
        <Input
          placeholderText={Emoji.forType(TYPE.RUN)}
          name="run"
          id={TYPE.RUN}
          units="km"
          value={currentMeasurements.find(byType(TYPE.RUN))?.value}
        />
        <hr />
        <Input
          placeholderText={Emoji.forType(TYPE.CALORIES)}
          name="calories"
          id={TYPE.CALORIES}
          units="cal"
          value={currentMeasurements.find(byType(TYPE.CALORIES))?.value}
        />
        <Input
          placeholderText={Emoji.forType(TYPE.WEIGHT)}
          name="weight"
          id={TYPE.WEIGHT}
          units="kg"
          value={currentMeasurements.find(byType(TYPE.WEIGHT))?.value}
        />
        <hr />
        <div className="px-5">
          <Button status={saveMeasurements.status} />
        </div>
      </form>

      {showShare && (
        <div className="flex flex-row justify-center">
          <Share
            onClick={() => {
              navigator.share({
                text: TYPES.map(
                  (type) =>
                    currentMeasurements.find(byType(type)) || { value: 0, type }
                )
                  .filter(({ value }) => value > 0)
                  .map(
                    ({ value, type }: { value: number; type: string }) =>
                      `${Emoji.forType(type)} ${Emoji.forValue(value)}`
                  )
                  .join("\n"),
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Form;

export enum Athlete {
  Adam = "Adam",
  Edd = "Edd",
  Paul = "Paul",
  Rich = "Rich",
  Rob = "Rob",
  Russ = "Russ",
  Scott = "Scott",
  TJ = "TJ",
}
export const Athletes = Object.values(Athlete);

export enum MeasurementType {
  RUN = "RUN",
  CYCLE = "CYCLE",
  SWIM = "SWIM",
  CALORIES = "CALORIES",
  WEIGHT = "WEIGHT",
}

export type Measurement = {
  type: MeasurementType;
  athlete: Athlete;
  value: number;
  week: string;
};

export function isExerciseType(value: string): value is MeasurementType {
  return value in MeasurementType;
}

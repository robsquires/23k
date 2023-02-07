export function forType(type: string) {
  switch (type) {
    case "RUN":
      return "🏃‍♂️";
    case "SWIM":
      return "🏊‍♂️";
    case "CYCLE":
      return "🚴‍♂️";
    case "WEIGHT":
      return "⚖️";
    case "CALORIES":
      return "🔥";
    default:
      throw Error("unknown type");
  }
}

export function forValue(value: number) {
  return value
    .toString()
    .replace(/0/g, "0️⃣")
    .replace(/1/g, "1️⃣")
    .replace(/2/g, "2️⃣")
    .replace(/3/g, "3️⃣")
    .replace(/4/g, "4️⃣")
    .replace(/5/g, "5️⃣")
    .replace(/6/g, "6️⃣")
    .replace(/7/g, "7️⃣")
    .replace(/8/g, "8️⃣")
    .replace(/9/g, "9️⃣")
    .replace(/\./g, "⏺");
}

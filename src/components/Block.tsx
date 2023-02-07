export const Block = () => (
  <div
    className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-lg
  "
  >
    <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>

      <span className="text-xs font-medium"> 67.81% </span>
    </div>

    <div>
      <strong className="block text-sm font-medium text-gray-500">
        {" "}
        🏃‍♂️ Running{" "}
      </strong>

      <p>
        <span className="text-2xl font-medium text-gray-900"> 23.1km </span>
      </p>
    </div>
  </div>
);

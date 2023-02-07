export const Input = ({
  name,
  id,
  placeholderText,
  units,
  value,
}: {
  name: string;
  id: string;
  placeholderText: string;
  units: string;
  value?: number;
}) => (
  <div className="flex">
    {/* <label htmlFor={name} className="block text-xs font-medium text-gray-700">
        asd
      </label> */}
    <span
      className="
      top-0
      right-0
      p-2.5
      text-center"
    >
      {placeholderText}
    </span>
    <input
      type="text"
      inputMode="decimal"
      name={name}
      id={id}
      className="w-full rounded-none rounded-l-lg pl-3 border border-gray-200 shadow-sm focus:outline-none focus:border focus:border-pink-600"
      defaultValue={value}
    />
    <span
      className="
        w-16
      top-0
      right-0
      p-2.5
      text-sm
      font-medium
      bg-gray-200
      rounded-r-lg
      border
      border-gray-200
      color-gray-700
      text-gray-700
      text-center
      shadow-sm
  "
    >
      {units}
    </span>
  </div>
);

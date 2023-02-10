const LoadingSpinner = () => (
  <div role="status" className="flex flex-col items-center p-0.5">
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-40"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

export const Button = ({
  isSuccess,
  isError,
  isLoading,
}: {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}) => {
  function renderText() {
    if (isError) {
      return "Something went wrong!";
    } else if (isSuccess) {
      return "You've charmed me";
    } else {
      return "Save";
    }
  }

  function renderColor() {
    if (isError) {
      return "bg-red-500";
    } else if (isSuccess) {
      return "bg-emerald-600";
    } else {
      return "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500";
    }
  }

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`
        w-full
        rounded-lg
        px-8
        py-3
        text-white
        active:text-opacity-75
        ${renderColor()}
      `}
    >
      {isLoading ? <LoadingSpinner /> : renderText()}
    </button>
  );
};

export const Share = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    onClick={onClick}
    className="group
    flex
    items-center
    justify-between
    rounded-lg
    border
    border-current
    px-5
    py-3
    text-emerald-600
    transition-colors
    hover:bg-emerald-600
    focus:outline-none"
  >
    <span className="font-medium transition-colors group-hover:text-white">
      Motivation 👉
    </span>
  </button>
);

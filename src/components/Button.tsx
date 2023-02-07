export const Button = ({ status }: { status: string }) => {
  function renderText() {
    switch (status) {
      case "loading":
        return "Saving..";
      case "error":
        return "Something went wrong!";
      case "success":
        return "You've charmed me";
      default:
        return "Save";
    }
  }

  function renderColor() {
    switch (status) {
      case "error":
        return "bg-red-500";
      case "success":
        return "bg-emerald-600";
      default:
        return "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500";
    }
  }

  return (
    <button
      type="submit"
      disabled={status === "loading"}
      className={`
        w-full
        rounded-lg
        px-8
        py-3
        text-white
        active:text-opacity-75
        ${renderColor()}
        ${status === "loading" ? " background-animate" : ""}
      `}
    >
      {renderText()}
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

import React from "react";

type Props = {
  onSelect: Function;
};

function Login({ onSelect }: Props) {
  return (
    <div className="relative block p-10">
      <div
        className="bg-clip-text text-transparent text-5xl font-extrabold bg-gradient-to-r
    from-pink-500
    via-red-500
    to-yellow-500
    background-animate"
      >
        <div className="mb-3 italic indent-1">Athlete,</div>
        <div className="text-4xl">select yo'self</div>
      </div>
      <hr className="mt-10" />
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="
        mt-5
        rounded
        p-3
        border
        border-gray-200
        shadow-sm
        focus:outline-none
        focus:border
        focus:border-pink-600
        float-right"
      >
        <option>👉</option>
        <option>Adam</option>
        <option>Edd</option>
        <option>Paul</option>
        <option>Rich</option>
        <option>Rob</option>
        <option>Russ</option>
        <option>Scott</option>
        <option>TJ</option>
      </select>
    </div>
  );
}

export default Login;

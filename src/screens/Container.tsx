import React from "react";
import { Block } from "../components/Block";
import Form from "./Form";

type Props = {
  user: string;
};

const weekLabel = "Fri 10th March";
const week = "2023-03-10";
function Container({ user }: Props) {
  return (
    <div className="px-10 flex flex-col space-y-2">
      <header aria-label="Page Header">
        <div className="mx-auto mt-2 max-w-screen-xl px-4 py-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Yes {user}!
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Enter your weekly stats 📲
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-0">
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
          <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
            <li className="flex items-center bg-white p-2">
              <span className="hidden sm:ml-2 sm:block" />
            </li>

            <li className="flex items-center bg-white p-2">
              <span className="h-6 px-3 rounded-full text-center text-[12px] font-bold leading-6 text-white  bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
                {`➡️ ${weekLabel}`}
              </span>
            </li>

            <li className="flex items-center bg-white p-2">
              <span className="hidden sm:ml-2 sm:block" />
            </li>
          </ol>
        </div>

        <div className="mt-4"></div>
        <Form athlete={user} week={week} />
      </div>
    </div>
  );
}

export default Container;

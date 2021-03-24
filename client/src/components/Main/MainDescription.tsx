import { Button } from "antd";
import { ReactElement } from "react";
import MainSearch from "./MainSearch";

const MainDescription = (): ReactElement => {
  return (
    <section className="text-gray-600">
      <div className="container flex flex-col items-center px-5 pt-6 pb-6 mx-auto md:flex-row md:pt12 md:pb-24">
        <div className="mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
          <img
            className="object-center rounded "
            alt="hero"
            src="./svg/E-learning.svg"
          />
        </div>
        <div className="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
          <h1 className="w-full mb-4 text-3xl font-medium text-center text-gray-900 title-font md:text-5xl">
            APRACADEMY
          </h1>
          <div className="w-20 h-1 bg-brand"></div>
          <div className="w-10 h-1 mt-2 bg-brand"></div>
          <p className="mb-8 text-xl leading-relaxed text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            quos aspernatur neque, provident enim ad molestiae reiciendis,
            adipisci optio error, ullam in. Rerum ea unde molestiae veritatis
            tempore nostrum vel!
          </p>
          <div className="flex justify-center">
            <button className="inline-flex px-6 py-2 text-lg text-white border-0 rounded bg-pacific-600 focus:outline-none hover:bg-pacific-400">
              Explore
            </button>
            <button className="inline-flex px-6 py-2 ml-4 text-lg text-gray-700 bg-gray-100 border-0 rounded focus:outline-none hover:bg-gray-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainDescription;

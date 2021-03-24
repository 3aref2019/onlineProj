import React from "react";
import { Link } from "react-router-dom";

function FooterComponent() {
  return (
    <footer className="text-white body-font bg-brand ">
      <div className="px-5 py-24 mx-auto ">
        <div className="flex flex-wrap justify-center -mx-4 -mb-10 text-center ">
          <div className="flex flex-col items-center px-4 w-w-1/2 lg:w-1/3">
            <h2 className="mb-3 text-lg font-medium tracking-widest text-white uppercase title-font">
              Website Pages
            </h2>
            <nav className="mb-10 space-y-2 list-none">
              <li>
                <a className="text-white hover:text-white">Homepage</a>
              </li>
              <li>
                <a className="text-white hover:text-white">About Us</a>
              </li>
              <li>
                <a className="text-white hover:text-white">Education</a>
              </li>
              <li>
                <a className="text-white hover:text-white">Our Facilities</a>
              </li>
            </nav>
          </div>
          <div className="flex flex-col items-center px-4 w-w-1/2 lg:w-1/3">
            <h2 className="mb-3 text-lg font-medium tracking-widest text-white uppercase title-font">
              Education
            </h2>
            <nav className="mb-10 space-y-2 list-none">
              <li>
                <a className="text-white hover:text-white">Articles</a>
              </li>
              <li>
                <a className="text-white hover:text-white">Workshop</a>
              </li>
              <li>
                <a className="text-white hover:text-white">Courses</a>
              </li>
              <li>
                <a className="text-white hover:text-white">Books</a>
              </li>
            </nav>
          </div>
          <div className="flex flex-col items-center px-4 w-w-1/2 lg:w-1/3">
            <h2 className="mb-3 text-lg font-medium tracking-widest text-white uppercase title-font">
              Our Facilities
            </h2>
            <nav className="mb-10 space-y-2 list-none">
              <li>
                <a className="text-white hover:text-white">Sports Recovery</a>
              </li>
              <li>
                <a className="text-white hover:text-white">
                  Athletic Performance
                </a>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex flex-wrap items-center px-5 py-8 mx-auto ">
          <div>
            <div className="flex flex-col flex-wrap px-5 py-4 mx-auto sm:flex-row">
              <p className="text-sm text-center text-white sm:text-left">
                © 2021 APR-ACADEMY — ALL COPYRIGHTS RSERVED
              </p>
            </div>
          </div>
          <span className="inline-flex justify-center w-full mt-6 lg:ml-auto lg:mt-0 md:justify-start md:w-auto">
            <a className="text-white">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a className="ml-3 text-white">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a className="ml-3 text-white">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
              </svg>
            </a>
            <a className="ml-3 text-white">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0}
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                />
                <circle cx={4} cy={4} r={2} stroke="none" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;

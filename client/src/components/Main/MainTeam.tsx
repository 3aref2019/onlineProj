import React from "react";

function MainTeam() {
  return (
    <section className="py-12 text-gray-600 body-font">
      <div className="w-20 h-1 bg-gray-400"></div>
      <div className="w-10 h-1 mt-2 bg-gray-400"></div>
      <div className="container px-5 py-6 mx-auto">
        <div className="flex flex-col w-full mb-20 text-center">
          <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font">
            Our Team
          </h1>
          <p className="mx-auto text-base leading-relaxed lg:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            reiciendis magni nobis aut ad voluptatum. Deleniti maxime tenetur
            at, laudantium inventore fuga ipsa odio possimus id beatae quasi ad
            harum.
          </p>
        </div>
        <div className="flex flex-wrap -m-2">
          <div className="w-full p-2 lg:w-1/3 md:w-1/2">
            <div className="flex items-center h-full p-4 border border-gray-200 rounded-lg">
              <img
                alt="team"
                className="flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full"
                src="https://www.digitalparadigm.ca/wp-content/uploads/2015/01/Picture-of-person.png"
              />
              <div className="flex-grow">
                <h2 className="font-medium text-gray-900 title-font">
                  John Doe
                </h2>
                <p className="text-gray-500">Instructor</p>
              </div>
            </div>
          </div>
          <div className="w-full p-2 lg:w-1/3 md:w-1/2">
            <div className="flex items-center h-full p-4 border border-gray-200 rounded-lg">
              <img
                alt="team"
                className="flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full"
                src="https://img.freepik.com/free-photo/mand-holding-cup_1258-340.jpg?size=626&ext=jpg"
              />
              <div className="flex-grow">
                <h2 className="font-medium text-gray-900 title-font">
                  John Doe
                </h2>
                <p className="text-gray-500">Instructor</p>
              </div>
            </div>
          </div>
          <div className="w-full p-2 lg:w-1/3 md:w-1/2">
            <div className="flex items-center h-full p-4 border border-gray-200 rounded-lg">
              <img
                alt="team"
                className="flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full"
                src="https://st.depositphotos.com/1269204/1219/i/600/depositphotos_12196477-stock-photo-smiling-men-isolated-on-the.jpg"
              />
              <div className="flex-grow">
                <h2 className="font-medium text-gray-900 title-font">
                  John Doe
                </h2>
                <p className="text-gray-500">Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainTeam;

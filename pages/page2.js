import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faTrain,
  faTaxi,
  faCar,
} from "@fortawesome/free-solid-svg-icons";

export default function Page() {
  const icons = ["bus", "bus", "train", "car", "taxi"];
  const headers = [
    "",
    "Total time spent while inside the vehicle",
    "Total travel time spent outside vehicle",
    "Possible delay due to traffic congestion or other uncertainties",
    "Total one-way cost of travel",
    "Extent of crowding in the vehicle",
    "Service type",
  ];
  const [data, setData] = useState([]); // Data of the table is stored here
  useEffect(() => {
    init();
  }, []);
  async function init() {
    fontawesome.library.add(faBus, faTrain, faTaxi, faCar);
    const response = await axios.post("/api/getTable", {
      // Send a POST request to the api section with the answers given by the user. Code is available at /api/getTable
      questions: JSON.parse(localStorage.getItem("answers")),
    });
    console.log(response.data);
    setData([...response.data]); //Saving the response to the data variable
  }
  return (
    <div className="bg-gradient-to-r pb-32 pt-16 from-purple-400 to-purple-500 min-h-screen">
      <Head>
        <title>Mode Choice</title>
      </Head>
      <h1 className="text-3xl mx-20 mb-8 font-bold">IISC Test 4</h1>
      <div className="rounded-md shadow-2xl text-lg shadow-purple-700 mx-8 bg-purple-100 bg-opacity-60 px-12 py-16">
        <div className="w-full">
          {data.map((v, index) => {
            //data is of the form [row1,row2,...] where each row is a [cell1,cell2]
            return (
              <div>
                {index != 0 ? ( //Used div instead of table to provide more flexiblity and customization
                  <div className="flex justify-center font-bold border-x-2 py-8 border-purple-500 bg-purple-400">
                    {headers[index]}
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="grid grid-cols-5 border border-purple-500">
                  {v.map((vi, i) => {
                    if (i % 2 == 0) {
                      // If i is even, then render a white background to the cell. Using this every alternate column has a more white background while the rest are transparent.
                      return (
                        <div className="flex flex-col items-center border border-purple-500 text-gray-700 p-4 bg-purple-100 bg-opacity-50">
                          {index == 1 ? (
                            <FontAwesomeIcon icon={icons[i]} /> //If the row index is 1 then render an icon depending on the column pos.
                          ) : (
                            <div></div>
                          )}
                          <div> {vi}</div>
                          {index == 0 ? ( //If the row index is 0 then render an radio.
                            <input
                              type="radio"
                              value={vi}
                              name="smth"
                              class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 checked:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            ></input>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col items-center border border-purple-500 text-gray-700 p-4">
                          {index == 1 ? (
                            <FontAwesomeIcon icon={icons[i]} /> //If the row index is 1 then render an icon depending on the column pos.
                          ) : (
                            <div></div>
                          )}
                          <div> {vi}</div>
                          {index == 0 ? ( //If the row index is 0 then render an radio.
                            <input
                              type="radio"
                              value={vi}
                              name="smth"
                              class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            ></input>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

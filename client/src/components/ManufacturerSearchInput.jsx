import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import Loading from "./Loading";
import Toast from "./Toast";

export default function ManufacturerSearchInput({
  selectedManufacturer,
  setSelectedManufacturer,
  manufacturers,
  setManufacturers,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function fetchManufacturers() {
      await Axios.get("/manufacturer").then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
        } else {
          setManufacturers(res.data);
          setLoading(false);
        }
      });
    }
    fetchManufacturers();
  }, []);

  //Applying our search filter function to our array of countries recieved from the API
  const filtered = manufacturers.filter((manufacturer) =>
    manufacturer.name.toLowerCase().includes(query)
  );

  return (
    <div>
      {toastType && toastMessage && (
        <Toast
          type={toastType}
          message={toastMessage}
          setToastMessage={setToastMessage}
          setToastType={setToastType}
        />
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full  bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto p-4 max-h-screen overflow-y-scroll">
          {selectedManufacturer && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  Selected Manufacturer
                </h5>
              </div>
              <div className="flow-root">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <li className="py-3 sm:py-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                          {selectedManufacturer.name}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </>
          )}
          <div className="my-4">
            <input
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Search Manufacturers"
              name="name"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              All Manufacturers
            </h5>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {manufacturers.length <= 0 ? (
                <p>No Manufacturers Found</p>
              ) : (
                filtered.map((manufacturer, index) => (
                  <li
                    key={index}
                    className="py-3 sm:py-2 cursor-pointer"
                    onClick={() => {
                      if (selectedManufacturer) {
                        // manufacturers.includes(selectedManufacturer,0) ? null : setManufacturers([...manufacturers, selectedManufacturer])
                        const objectWithIdIndex = manufacturers.findIndex(
                          (manufacturers1) =>
                            manufacturers1._id === manufacturer._id
                        );
                        manufacturers.splice(objectWithIdIndex, 1);
                        setManufacturers([
                          ...manufacturers,
                          selectedManufacturer,
                        ]);
                        setSelectedManufacturer(manufacturer);
                        console.log(manufacturers.length);
                        setQuery("");
                      } else {
                        setSelectedManufacturer(manufacturer);
                        const objectWithIdIndex = manufacturers.findIndex(
                          (manufacturers1) =>
                            manufacturers1._id === manufacturer._id
                        );
                        manufacturers.splice(objectWithIdIndex, 1);
                        setQuery("");
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                          {manufacturer.name}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

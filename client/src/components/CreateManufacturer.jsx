import { useState } from "react";
import Axios from "../utils/Axios";
import Toast from "./Toast";

export default function CreateManufacturer({ setOpen }) {
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (description === null) {
        setToastType("error");
        setToastMessage("Manufacturer description is required");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (name === null) {
        setToastType("error");
        setToastMessage("Manufacturer name is required");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        await Axios.post("/manufacturer", formData).then((res) => {
          if (res.data.messageType === "error") {
            setToastType(res.data.messageType);
            setToastMessage(res.data.message);
            setTimeout(() => {
              setToastType(null);
              setToastMessage(null);
            }, 3000);
          } else {
            setToastType(res.data.messageType);
            setToastMessage(res.data.message);
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {toastType && toastMessage ? (
        <Toast
          toastType={toastType}
          toastMessage={toastMessage}
          setToastMessage={setToastMessage}
          setToastType={setToastType}
        />
      ) : null}

      <form
        className="transition-all w-3/4 md:w-1/2 mx-auto pt-4"
        encType="multipart/form-data"
        onSubmit={submitForm}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 ml-auto cursor-pointer text-red-700"
          onClick={() => setOpen(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <input
            type="text"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create Manufacturer
          </button>
        </div>
      </form>
    </>
  );
}

import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import ManufacturerSearchInput from "./ManufacturerSearchInput";
import TagSearchInput from "./TagSearchInput";
import Loading from "./Loading";
import Toast from "./Toast";

export default function CreateProduct({ setOpen }) {
  const [previews, setPreviews] = useState([]);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const selectedTagsIds = selectedTags.map((tag) => tag._id);

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

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (images === null) {
        setToastType("error");
        setToastMessage("Please upload an image");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (name === null) {
        setToastType("error");
        setToastMessage("Product name cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (description === null) {
        setToastType("error");
        setToastMessage("Product description cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (price === null) {
        setToastType("error");
        setToastMessage("Product price cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (discount === null) {
        setToastType("error");
        setToastMessage("Product discount cannot be empty");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (selectedManufacturer === null) {
        setToastType("error");
        setToastMessage("Please select an manufacturer");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else if (selectedTags.length <= 0) {
        setToastType("error");
        setToastMessage("Please add at least one tag");
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        images.forEach((image) => {
          formData.append("image", image);
        });
        formData.append("manufacturer", selectedManufacturer._id);
        formData.append("price", price);
        formData.append("discount", discount);
        for (let i = 0; i < selectedTagsIds.length; i++) {
          formData.append("tags", selectedTagsIds[i]);
        }

        await Axios.post("/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
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

  // Use useEffect to log the updated state
  useEffect(() => {
    console.log(previews);
    console.log(images);
  }, [previews, images]);

  const handleImageUpload = (e) => {
    const targetFiles = e.target.files;
    setImages(Array.from(targetFiles)); // Set the new images directly
    setPreviews(
      Array.from(targetFiles).map((file) => URL.createObjectURL(file))
    );
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
      {!loading ? (
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
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter name"
              name="title"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="description"
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
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Price
            </label>
            <input
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter price"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="discount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Discount
            </label>
            <input
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter discount"
              name="discount"
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </div>
          {previews &&
            previews.map((preview, index) => (
              <div className="mb-6" key={index}>
                <img
                  className="h-auto min-w-full rounded-lg"
                  src={preview}
                  alt="Upload Preview"
                />
              </div>
            ))}
          <div className="flex items-center justify-center w-full mb-6">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="flex flex-col mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold mx-auto">
                    Click to upload your image
                  </span>
                  <br />
                  <span className="font-semibold mx-auto">
                    Image must be in 1280 x 720 resolution
                  </span>
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
              />
            </label>
          </div>
          <div className="mb-6">
            <ManufacturerSearchInput
              selectedManufacturer={selectedManufacturer}
              setSelectedManufacturer={setSelectedManufacturer}
              manufacturers={manufacturers}
              setManufacturers={setManufacturers}
            />
          </div>
          <div>
            <TagSearchInput
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={tags}
              setTags={setTags}
              selectedTagsIds={selectedTagsIds}
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create Product
            </button>
          </div>
        </form>
      ) : (
        <Loading />
      )}
    </>
  );
}

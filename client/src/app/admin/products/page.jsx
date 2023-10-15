"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../../components/AdminNavbar";
import Loading from "../../../components/Loading";
import Axios from "../../../utils/Axios";
import CreateProduct from "../../../components/CreateProduct";
import DeleteModalProduct from "../../../components/DeleteModalProduct";
import ManufacturerSearchInput from "../../../components/ManufacturerSearchInput";
import TagSearchInput from "../../../components/TagSearchInput";
import Toast from "../../../components/Toast";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [toUpdate, setToUpdate] = useState({});
  const [toDelete, setToDelete] = useState({});
  const [previews, setPreviews] = useState([]);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [images, setImages] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const selectedTagsIds = selectedTags.map((tag) => tag._id);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const newImages = images.flat();

  function removeSelectedManufacturer() {
    for (let i = 0; i < manufacturers.length; i++) {
      const manufacturer = manufacturers[i];
      if (manufacturer._id === selectedManufacturer._id) {
        manufacturers.splice(i, 1);
      }
    }
    return manufacturers;
  }

  function removeSelectedTags() {
    for (let i = 0; i < selectedTags.length; i++) {
      const selectedTag = selectedTags[i];
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag._id === selectedTag._id) {
          tags.splice(i, 1);
        }
      }
    }
    return tags;
  }

  async function fetchProducts() {
    await Axios.get("/product").then((res) => {
      if (res.data.messageType === "error") {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
      } else {
        setProducts(res.data);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function deleteProduct(id) {
    Axios.delete(`/product/${id}`).then((res) => {
      if (res.data.messageType === "error") {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        setTimeout(() => {
          setToastType(null);
          setToastMessage(null);
        }, 3000);
        setDeleteModal(false);
      } else {
        setToastType(res.data.messageType);
        setToastMessage(res.data.message);
        window.location.reload();
      }
    });
  }

  const handleImageUpload = (e) => {
    setImages((prevImages) =>
      e.target.files.length > 1
        ? e.target.files.map((file) => [...prevImages, file])
        : prevImages.length > 0
        ? [...prevImages, e.target.files[0]]
        : [e.target.files[0]]
    );

    console.log(images);
    console.log(images);
    console.log(images.length);

    setPreviews((prevPreviews) => [
      ...prevPreviews,
      ...(e.target.files.length > 1
        ? e.target.files.map((file) => `${URL.createObjectURL(file)}`)
        : []),
    ]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      newImages.map((newImage, i) => {
        formData.append("image", newImage);
      });
      formData.append("manufacturer", selectedManufacturer._id);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("oldImages", [
        ...new Set(
          previews
            .flat()
            .filter((preview) => preview !== preview.includes("data"))
        ),
      ]);
      for (let i = 0; i < selectedTagsIds.length; i++) {
        formData.append("tags", selectedTagsIds[i]);
      }
      await Axios.put(`/product/${toUpdate._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        if (res.data.messageType === "error") {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          setTimeout(() => {
            setToastType(null);
            setToastMessage(null);
          }, 3000);
          setDeleteModal(false);
        } else {
          setToastType(res.data.messageType);
          setToastMessage(res.data.message);
          window.location.reload();
        }
      });
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
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
          <AdminNavbar />
          {!open ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-3/4 md:w-1/2 mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create Product
            </button>
          ) : (
            <CreateProduct setOpen={setOpen} />
          )}
          {deleteModal ? (
            <DeleteModalProduct
              setDeleteModal={setDeleteModal}
              toDelete={toDelete}
              deleteProduct={deleteProduct}
            />
          ) : null}
          {updateModal ? (
            <div className="z-50 relative w-full max-w-[100%] md:max-w-[50%] mx-auto">
              <form
                className="mx-auto pt-4"
                encType="multipart/form-data"
                onSubmit={updateProduct}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-auto cursor-pointer text-red-700"
                  onClick={() => setUpdateModal(false)}
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
                    placeholder="Enter title"
                    name="title"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
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
                    value={description}
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
                    value={price}
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
                    value={discount}
                    required
                  />
                </div>
                {/* {previews &&
                  previews.map((currentPreview, index) => (
                    <div className="mb-6" key={index}>
                      <div
                        onClick={() =>
                          setPreviews(
                            previews.filter(
                              (preview) => preview !== currentPreview
                            )
                          )
                        }
                        className="cursor-pointer bg-red-600 text-white rounded-t-lg text-center w-1/6 ml-auto"
                      >
                        Delete
                      </div>
                      <img
                        className="h-auto min-w-full rounded-lg"
                        src={currentPreview}
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
                      name="image"
                      multiple
                    />
                  </label>
                </div> */}
                <div className="mb-6">
                  <ManufacturerSearchInput
                    selectedManufacturer={selectedManufacturer}
                    setSelectedManufacturer={setSelectedManufacturer}
                    manufacturers={
                      selectedManufacturer
                        ? removeSelectedManufacturer()
                        : manufacturers
                    }
                    setManufacturers={setManufacturers}
                  />
                </div>
                <div>
                  <TagSearchInput
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    tags={selectedTags ? removeSelectedTags() : tags}
                    setTags={setTags}
                    selectedTagsIds={selectedTagsIds}
                  />
                </div>
                <div className="mb-6">
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg w-full mx-auto text-sm px-5 py-2.5 my-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Update Product
                  </button>
                </div>{" "}
              </form>
            </div>
          ) : null}
          <div className="w-full md:max-w-[50%] max-w-[75%] bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                All Products
              </h5>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <li className="py-3 sm:py-2" key={index}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="aspect-square w-[36px] h-[36px] md:w-[72px] md:h-[72px] rounded-lg"
                            src={product.images[0]}
                            alt="Neil image"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 truncate dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                            {product.manufacturer.name}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 m-[0.125rem] md:m-2 cursor-pointer"
                            onClick={() => {
                              setToUpdate(product);
                              setPreviews(product.images);
                              setName(product.name);
                              setDescription(product.description);
                              setPrice(product.price);
                              setDiscount(product.discount);
                              setSelectedTags(product.tags);
                              setSelectedManufacturer(product.manufacturer);
                              setUpdateModal(true);
                              console.log(images);
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 m-[0.125rem] md:m-2 cursor-pointer"
                            onClick={() => {
                              setToDelete(product);
                              setDeleteModal(true);
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No Products Found</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

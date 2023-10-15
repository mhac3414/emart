"use client";
import UserCard from "../../components/UserCard";
import Axios from "../../utils/Axios";
import { useEffect, useState } from "react";

export default function page() {
  const [manufacturers, setManufacturers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const productsRelateManufacturer = products.filter(
    (product) => product.manufacturer._id === selectedManufacturer
  );
  useEffect(() => {
    Axios.get("/manufacturer")
      .then((res) => {
        setManufacturers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    Axios.get("/product")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="flex flex-row justify-center mt-2">
        <button
          onClick={() => {
            setSelectedManufacturer("all");
          }}
          type="button"
          class={`${
            selectedManufacturer === "all"
              ? "text-white bg-slate-900  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              : "border-2 border-slate-900 bg-white  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
          }`}
        >
          All
        </button>
        {manufacturers.map((manufacturer) => (
          <button
            onClick={() => {
              setSelectedManufacturer(manufacturer._id);
            }}
            type="button"
            class={`${
              selectedManufacturer === manufacturer._id
                ? "text-white bg-slate-900  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                : "border-2 border-slate-900 bg-white  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
            }`}
          >
            {manufacturer.name}
          </button>
        ))}
      </div>
      <hr />
      <div className="flex flex-col w-full justify-center mx-4">
        <div className="items-center justify-center">
          <div className=" mt-10 grid grid-cols-4 gap-2">
            {selectedManufacturer !== "all"
              ? productsRelateManufacturer.map((product) => (
                  <UserCard key={product._id} product={product} />
                ))
              : products.map((product) => (
                  <UserCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

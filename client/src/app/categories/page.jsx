"use client";
import UserCard from "../../components/UserCard";
import Axios from "../../utils/Axios";
import { useEffect, useState } from "react";

export default function page() {
  const [tags, setTags] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const productsRelateTag = products.filter((product) =>
    product.tags.some((tag) => tag._id === selectedTag)
  );
  useEffect(() => {
    Axios.get("/tag")
      .then((res) => {
        setTags(res.data);
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
            setSelectedTag("all");
          }}
          type="button"
          class={`${
            selectedTag === "all"
              ? "text-white bg-slate-900  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
              : "border-2 border-slate-900 bg-white  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            onClick={() => {
              setSelectedTag(tag._id);
            }}
            type="button"
            class={`${
              selectedTag === tag._id
                ? "text-white bg-slate-900  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
                : "border-2 border-slate-900 bg-white  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
            }`}
          >
            {tag.title}
          </button>
        ))}
      </div>
      <hr />
      <div className="flex flex-col w-full justify-center mx-4">
        <div className="items-center justify-center">
          <div className=" mt-10 grid grid-cols-4 gap-2">
            {selectedTag !== "all"
              ? productsRelateTag.map((product) => (
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

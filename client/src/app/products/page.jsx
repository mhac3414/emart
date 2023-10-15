"use client";
import UserCard from "../../components/UserCard";
import Axios from "../../utils/Axios";
import { useEffect, useState } from "react";

export default function page() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const productsRelateTag = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

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
      <div className="flex flex-row justify-center my-2">
        <input
          type="text"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 mx-4"
          placeholder="Search Product with Name"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <hr />
      <div className="flex flex-col w-full justify-center mx-4">
        <div className="items-center justify-center">
          <div className=" mt-10 grid grid-cols-4 gap-2">
            {productsRelateTag.map((product) => (
              <UserCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

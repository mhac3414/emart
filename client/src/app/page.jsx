"use client";

import UserCard from "../components/UserCard";
import Axios from "../utils/Axios";
import { useEffect, useState } from "react";

export default function page() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Axios.get("/product")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err); 
      });
  }, []);

  const todaysDeals = [...products].sort((a, b) => b.discount - a.discount);
  const lowestPrice = [...products].sort((a, b) => a.price - b.price);
  const highestPrice = [...products].sort((a, b) => b.price - a.price);

  return (
    <>
      <div className="flex flex-col w-full justify-center">
        <p className="text-4xl font-bold text-center bg-slate-900 text-white py-2">
          Today's Deals
        </p>
        <div className="flex flex-row justify-center mt-10 gap-3">
          {todaysDeals.slice(0, 4).map((product) => (
            <UserCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full justify-center">
        <p className="text-4xl font-bold text-center mt-5 bg-slate-900 text-white py-2">
          Low Price Products
        </p>
        <div className="flex flex-row justify-center mt-10 gap-3 ">
          {lowestPrice.slice(0, 4).map((product) => (
            <UserCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full justify-center">
        <p className="text-4xl font-bold text-center mt-5 bg-slate-900 text-white py-2">
          High Price Products
        </p>
        <div className="flex flex-row justify-center mt-10 gap-3 ">
          {highestPrice.slice(0, 4).map((product) => (
            <UserCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

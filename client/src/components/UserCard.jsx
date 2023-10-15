export default function UserCard({ product }) {
  const { name, description, price, discount, images } = product;
  return (
    <div className="max-w-xs bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      {discount > 0 ? <div className="absolute bg-slate-900 right-[42%] -top-8 h-16 w-16 rounded-full ">
        <p className="text-center mt-4 text-white text-xl">{discount}%</p>
      </div> : null}
      <a href="#">
        <img className="min-w-full" src={images[0]} alt="" />
      </a>
      <div className="p-5">
        <a href="#">
          <div className="flex gap-2">
            {discount > 0 ? (<>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            ₹{(price - (discount / 100) * price).toFixed(0)}
            </h5>
            <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white line-through">
            ₹{price}
            </h5>
            </>):(
            <h5 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">
            ₹{price}
            </h5>)}
          </div>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

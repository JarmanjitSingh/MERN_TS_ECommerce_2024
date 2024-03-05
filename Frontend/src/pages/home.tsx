import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import Loader from "../components/loader";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = () => {};

  if (isError) toast.error("Cannot fetch the products");
  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="findMore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Loader />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              photo={i.photo}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;

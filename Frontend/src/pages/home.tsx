import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";

const Home = () => {
  const addToCartHandler = () => {};
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
        <ProductCard
          photo="https://m.media-amazon.com/images/I/31ilq3hPhEL._SY445_SX342_QL70_FMwebp_.jpg"
          productId="dfdasfdaf"
          name="Mackbook"
          price={4568}
          stock={434}
          handler={addToCartHandler}
        />
      </main>
    </div>
  );
};

export default Home;

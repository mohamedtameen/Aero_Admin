import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Products.css";
import { addToCart } from "../utils/cartUtils";
function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }
  function handleBuyNow(product) {
    navigate("/address", { state: { product } });
  }

  return (
    <div className="products-container">
      <h2 className="products-title">Spare Parts</h2>

      {filteredProducts.length === 1 ? (
        // Single Product View
        <div className="single-product-container">
          <div className="product-card single-product-card">
            <img
              src={`http://localhost:5000${filteredProducts[0].image}`}
              alt={filteredProducts[0].name}
            />
            <h3 className="product-name">{filteredProducts[0].name}</h3>
            <p className="product-description">
              {filteredProducts[0].description.length > 80
                ? filteredProducts[0].description.slice(0, 80) + "..."
                : filteredProducts[0].description}
            </p>
            <p className="product-price">
              Price: Rs {filteredProducts[0].price}
            </p>
            {/* <p className="product-info">
              Stock:{" "}
              {filteredProducts[0].stock > 0
                ? filteredProducts[0].stock
                : "Out of Stock"}
            </p> */}
            <button
              className="add-button"
              disabled={filteredProducts[0].stock === 0}
              // onClick={() => addToCart(filteredProducts[0])}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              Add to Cart
            </button>
            <button
              className="buy-button"
              disabled={filteredProducts[0].stock === 0}
              onClick={() => handleBuyNow(filteredProducts[0])}
            >
              Buy Now
            </button>
          </div>
        </div>
      ) : (
        // Multiple Products Grid
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">
                {product.description.length > 80
                  ? product.description.slice(0, 80) + "..."
                  : product.description}
              </p>
              <p className="product-price">Price: Rs {product.price}</p>
              <p className="product-info">
                Stock: {product.stock > 0 ? product.stock : "Out of Stock"}
              </p>
              <div className="products-btn">
                <button
                  className="add-button"
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="buy-button"
                  disabled={product.stock === 0}
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;

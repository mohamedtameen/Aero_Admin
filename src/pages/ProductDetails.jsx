// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetails.css";
import { addToCart } from "../utils/cartUtils";
function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product by ID
    fetch(`http://localhost:5000/api/products`)
      .then((res) => res.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.id === parseInt(id));
        setProduct(foundProduct);
        // Filter out current product and pick 3 random others
        const similar = data
          .filter((p) => p.id !== parseInt(id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setSimilarProducts(similar);
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [id]);

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }

  function handleBuyNow(product) {
    navigate("/address", { state: { product } });
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-container">
      <h2 className="product-detail-title">{product.name}</h2>
      <div className="product-detail-main">
        <img
          className="product-detail-image"
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
        />
        <div className="product-detail-info">
          <h3 className="product-detail-name">{product.name}</h3>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-price">Price: Rs {product.price}</p>
          {/* <p className="product-detail-stock">
            Stock: {product.stock > 0 ? product.stock : "Out of Stock"}
          </p> */}
          <div className="product-detail-buttons">
            <button
              className="product-detail-add-btn"
              disabled={product.stock === 0}
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="product-detail-buy-btn"
              disabled={product.stock === 0}
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

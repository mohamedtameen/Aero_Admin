import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/OrderStatus.css";

function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.name) return;

    Promise.all([
      fetch("http://localhost:5000/api/orders").then((res) => res.json()),
      fetch("http://localhost:5000/api/products").then((res) => res.json()),
    ])
      .then(([ordersData, productsData]) => {
        const userOrders = ordersData
          .filter((order) => order.customer === user.name)
          .map((order) => {
            const matchedProduct = productsData.find(
              (p) => p.name === order.product
            );
            return {
              ...order,
              productId: matchedProduct?.id,
              image: matchedProduct?.image,
            };
          });

        setOrders(userOrders.filter((o) => o.status.toLowerCase() !== "delivered"));
        setDeliveredOrders(userOrders.filter((o) => o.status.toLowerCase() === "delivered"));
        setProducts(productsData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, [user]);

  const statusFlow = [
    { key: "pending", label: "Pending", icon: <ClockCircleOutlined /> },
    { key: "shipped", label: "Shipped", icon: <CarOutlined /> },
    { key: "delivered", label: "Delivered", icon: <CheckCircleOutlined /> },
  ];

  const isActiveOrCompleted = (current, step) => {
    const orderIndex = statusFlow.findIndex((s) => s.key === current);
    const stepIndex = statusFlow.findIndex((s) => s.key === step);
    return stepIndex <= orderIndex;
  };

  return (
    <div className="order-status-container">
      <h2>My Orders</h2>

      <div className="order-history-toggle">
        <button onClick={() => setHistoryOpen((prev) => !prev)}>
          {historyOpen ? "Hide Order History" : "Show Order History"}
        </button>
        {historyOpen && (
          <div className="order-history-dropdown">
            {deliveredOrders.length === 0 ? (
              <p>No delivered orders yet.</p>
            ) : (
              deliveredOrders.map((order) => (
                <Link
                  to={`/products/${order.productId}`}
                  className="order-history-item"
                  key={order.id}
                >
                  <img
                    src={`http://localhost:5000${order.image}`}
                    alt={order.product}
                  />
                  <span>{order.product}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="empty-message">You have no active orders.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-status-flow">
              <div className="order-product-info">
                <img
                  src={`http://localhost:5000${order.image}`}
                  alt={order.product}
                  className="order-product-image"
                />
                <div className="order-product-text">
                  <h3>{order.product}</h3>
                  {order.productId && (
                    <Link
                      to={`/products/${order.productId}`}
                      className="view-product-link"
                    >
                      View Product
                    </Link>
                  )}
                </div>
              </div>
              <div className="status-flow">
                {statusFlow.map(({ key, label, icon }) => {
                  const active = isActiveOrCompleted(
                    order.status.toLowerCase(),
                    key
                  );
                  return (
                    <div
                      key={key}
                      className={`status-step ${
                        active ? "active" : "inactive"
                      }`}
                    >
                      <div className="icon">{icon}</div>
                      <div className="label">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderStatus;

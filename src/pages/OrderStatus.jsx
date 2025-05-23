import React, { useEffect, useState } from "react";
import {
  ClockCircleOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "../styles/OrderStatus.css";

function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.name) return;

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter((order) => order.customer === user.name);
        setOrders(userOrders);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, [user]);

  // Map statuses to icons and labels
  const statusFlow = [
    { key: "pending", label: "Pending", icon: <ClockCircleOutlined /> },
    { key: "shipped", label: "Shipped", icon: <CarOutlined /> },
    { key: "delivered", label: "Delivered", icon: <CheckCircleOutlined /> },
  ];

  // Helper to check if a status is active or completed relative to current order status
  const isActiveOrCompleted = (current, step) => {
    const orderIndex = statusFlow.findIndex((s) => s.key === current);
    const stepIndex = statusFlow.findIndex((s) => s.key === step);
    return stepIndex <= orderIndex;
  };

  return (
    <div className="order-status-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="empty-message">You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-status-flow">
              <h3>{order.product}</h3>
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

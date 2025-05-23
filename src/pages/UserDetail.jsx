import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../styles/UserDetail.css";

function UserDetail() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // redirect to login if no userId
      return;
    }

    fetch(`http://localhost:5000/api/customers/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user details");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load user data.");
      });
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const goToOrders = () => {
    navigate("/order-status");
  };

  if (!user) return <div className="loading">Loading user details...</div>;

  return (
    <div className="user-detail-container">
      <h2 className="user-detail-title">
        <UserOutlined
          style={{ marginRight: "8px", fontSize: "24px", color: "#2c3e50" }}
        />
        User Details
      </h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phno}
      </p>
      <p>
        <strong>Subscribed:</strong> {user.subscribed ? "Yes" : "No"}
      </p>
      <p>
        <strong>Registered On:</strong>{" "}
        {new Date(user.date).toLocaleDateString()}
      </p>

      <div className="button-group">
        <button onClick={goToOrders} className="order-status-btn">
          View Orders
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDetail;

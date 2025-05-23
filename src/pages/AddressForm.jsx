import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/AddressForm.css";

function AddressForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [customer, setCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const location = useLocation();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [selectedSlot, setSelectedSlot] = useState(null); // For selected address

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:5000/api/customers/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
        // Auto select first address if exists
        if (data.address) setSelectedSlot(1);
        else if (data.address2) setSelectedSlot(2);
        else if (data.address3) setSelectedSlot(3);
      })
      .catch(console.error);
  }, [user]);

  const addresses = [
    {
      slot: 1,
      address: customer?.address,
      city: customer?.city,
      state: customer?.state,
    },
    {
      slot: 2,
      address: customer?.address2,
      city: customer?.city2,
      state: customer?.state2,
    },
    {
      slot: 3,
      address: customer?.address3,
      city: customer?.city3,
      state: customer?.state3,
    },
  ].filter((a) => a.address);

  const openModal = (slot) => {
    setEditingSlot(slot);
    if (slot <= 3 && customer) {
      setFormData({
        address: customer[`address${slot === 1 ? "" : slot}`] || "",
        city: customer[`city${slot === 1 ? "" : slot}`] || "",
        state: customer[`state${slot === 1 ? "" : slot}`] || "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.state) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/${user.id}/address/${editingSlot}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update address");
      const updated = await res.json();
      alert(updated.message);
      setShowModal(false);
      // Reload customer data
      const updatedCustomer = await fetch(
        `http://localhost:5000/api/customers/${user.id}`
      ).then((res) => res.json());
      setCustomer(updatedCustomer);
      setSelectedSlot(editingSlot); // select the updated/added address
    } catch (error) {
      console.error(error);
      alert("Error updating address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      alert("Please select an address");
      return;
    }
    const addrKey = `address${selectedSlot === 1 ? "" : selectedSlot}`;
    const cityKey = `city${selectedSlot === 1 ? "" : selectedSlot}`;
    const stateKey = `state${selectedSlot === 1 ? "" : selectedSlot}`;
    const selectedAddress = {
      address: customer[addrKey],
      city: customer[cityKey],
      state: customer[stateKey],
    };

    console.log("Selected address:", selectedAddress);
    console.log("Product:", product);

    if (!selectedAddress.address || !product) {
      alert("Missing address or product info");
      return;
    }

    try {
      const orderRes = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          customer: customer.name,
          product: product.name,
          quantity: 1,
          total: product.price,
          status: "Pending",
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to place order");

      alert("Order placed successfully!");
      // Redirect or update UI as needed here
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Error placing order");
    }
  };

  return (
    <div className="address-form-container">
      <h2>Shipping Addresses</h2>
      {addresses.length === 0 && <p>No saved addresses found.</p>}

      {addresses.map(({ slot, address, city, state }) => (
        <div key={slot} className="address-block">
          <label>
            <input
              type="radio"
              name="selectedAddress"
              value={slot}
              checked={selectedSlot === slot}
              onChange={() => setSelectedSlot(slot)}
            />
            <b>Address {slot}:</b> {address}, {city}, {state}
          </label>
          <button
            className="add-address-btn"
            onClick={() => openModal(slot)}
            style={{ marginLeft: "10px" }}
          >
            Edit
          </button>
        </div>
      ))}

      {addresses.length < 3 && (
        <button
          className="add-address-btn"
          onClick={() => openModal(addresses.length + 1)}
        >
          Add Address
        </button>
      )}

      <button
        className="submit-button"
        onClick={handlePlaceOrder}
        disabled={!selectedSlot}
        style={{ marginTop: "20px" }}
      >
        Confirm & Place Order
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>
              {editingSlot ? `Edit Address ${editingSlot}` : "Add Address"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressForm;

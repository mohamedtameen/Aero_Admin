import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import UserDetail from "./pages/UserDetail";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import AddressForm from "./pages/AddressForm";
import OrderStatus from "./pages/OrderStatus";
import ProductDetail from "./pages/ProductDetails";
import "./App.css"
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/address" element={<AddressForm />} />
        <Route path="/order-status" element={<OrderStatus/>} />
        <Route path="//products/:id" element={<ProductDetail/>} />
        <Route path="/user" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
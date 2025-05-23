import { useState, useEffect } from "react";
import Logo from "../assets/aero_logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  MenuOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search.trim()}`);
      setMenuOpen(false);
      setSearch("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    navigate(`/products?search=${value}`);
    setSearch("");
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearch(input);
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      .filter((p) => p.name.toLowerCase().startsWith(input.toLowerCase()))
      .map((p) => p.name);
    setSuggestions(filtered);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" title="logo">
          <h1><img src={Logo} alt="" /></h1>
        </Link>
      </div>

      <div className="navbar-search-container">
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={handleInputChange}
          />
          <button type="submit">
            <SearchOutlined />
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" title="Home" onClick={closeMenu}>
          <HomeOutlined /> Home
        </Link>
        <Link to="/products" title="Spare Parts" onClick={closeMenu}>
          <ShoppingOutlined /> Parts
        </Link>
        <Link to="/cart" title="Cart" onClick={closeMenu}>
          <ShoppingCartOutlined /> Cart
        </Link>
        <Link to="/contact" title="Contact" onClick={closeMenu}>
          <PhoneOutlined /> Contact
        </Link>
        <Link
          to="/user"
          title="Profile"
          className="mobile-profile"
          onClick={closeMenu}
        >
          <UserOutlined /> Profile
        </Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </div>
    </nav>
  );
}

export default Navbar;

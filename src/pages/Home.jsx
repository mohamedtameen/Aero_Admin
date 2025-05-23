import { useEffect, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";
import logo from "../assets/aero_logo.png";
import engine from "../assets/engine.jpeg";
import landingGear from "../assets/landing-gear.jpeg";
import avionics from "../assets/avionics.jpeg";
import {
  SafetyCertificateOutlined,
  DollarCircleOutlined,
  AimOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";

const sparePartImages = [engine, landingGear, avionics];

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/customers")
      .then((res) => res.json())
      .then((data) => setReviews(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-banner">
        <Slider {...sliderSettings}>
          {sparePartImages.map((src, idx) => (
            <div key={idx} className="carousel-image-wrapper">
              <img
                src={src}
                alt={`Spare Part ${idx + 1}`}
                className="carousel-image"
              />
            </div>
          ))}
        </Slider>
      </section>
      <section className="home-section about-section">
        <h2>Aero Spare Parts</h2>
        <p>
          We provide top-quality aerospace spare parts, from engines to sensors,
          supporting the aviation industry with reliability and speed.
        </p>
      </section>
      <section className="home-section website-section">
        <h2>About This Website</h2>
        <p>
          We specialize in the supply of high-quality aerospace spare parts,
          catering to both commercial and military aviation sectors. Our
          comprehensive inventory includes critical components such as aircraft
          engines, avionics, sensors, landing gear, actuators, hydraulics,
          electrical systems, airframe structures, and flight control parts.
          Each product is sourced from trusted OEMs and certified suppliers,
          ensuring compliance with international aviation standards and
          regulations. Our commitment to excellence is reflected in our ability
          to deliver reliable parts with speed and precision. We understand the
          demands of the aerospace industry and prioritize minimal downtime by
          maintaining a responsive supply chain, efficient logistics, and 24/7
          customer support. Whether you're looking for legacy aircraft parts,
          modern system upgrades, or urgent AOG (Aircraft on Ground) support, we
          provide tailored solutions to meet your operational needs. Trust us as
          your strategic partner in aviation maintenance, repair, and overhaul
          (MRO), where quality, reliability, and performance come first.
        </p>
      </section>
      <section className="home-section features-section">
        <h3 className="features-title">
          Why Choose <span className="highlight">AeroSpare Hub?</span>
        </h3>
        <div className="features-grid">
          <div className="feature-card">
            <SafetyCertificateOutlined className="feature-icon" />
            <h3>Original Products</h3>
            <p>Only reliable parts from trusted aftermarket brands.</p>
          </div>
          <div className="feature-card">
            <DollarCircleOutlined className="feature-icon" />
            <h3>Affordable Rates</h3>
            <p>
              Cost-effective solutions for maintenance without compromising
              quality.
            </p>
          </div>
          <div className="feature-card">
            <AimOutlined className="feature-icon" />
            <h3>Wide Variety</h3>
            <p>From engines to electronics—find everything in one place.</p>
          </div>
        </div>
      </section>
      <section className="home-section review-section">
        <h2>User Reviews</h2>
        <div className="review-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="user-profile">
                <UserOutlined />
                <h4>{review.name}</h4>
              </div>
              <p>Email: {review.email}</p>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <StarFilled
                    key={i}
                    style={{ color: "#fadb14", marginRight: 4 }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <img src={logo} alt="AeroSpare Logo" className="footer-logo" />
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/products">Spare Parts</a>
            <a href="/cart">Cart</a>
            <a href="/user">Profile</a>
            <a href="/contact">Contact</a>
          </div>
          <p className="footer-copy">© 2025 AeroSpare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

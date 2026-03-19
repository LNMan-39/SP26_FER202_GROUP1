import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Subscribed successfully! Thank you for joining our newsletter.");
    e.target.reset(); // Reset form
  };

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">
          {/* Cột 1 - Giới thiệu */}
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">TigerVN</h5>
            <p>
              Your one-stop destination for trendy fashion and clothing. We
              bring you the latest styles at affordable prices.
            </p>
          </div>

          {/* Cột 2 - Liên kết nhanh */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Quick Links
            </h5>
            <p>
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>
            </p>
            <p>
              <Link
                to="/product-list"
                className="text-white text-decoration-none"
              >
                Shop All
              </Link>
            </p>
            <p>
              <Link to="/" className="text-white text-decoration-none">
                Featured Products
              </Link>
            </p>
          </div>

          {/* Cột 3 - Hỗ trợ khách hàng */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">
              Customer Service
            </h5>
            <p>
              <Link to="/contact" className="text-white text-decoration-none">
                Contact Us
              </Link>
            </p>
            <p>
              <Link to="/contact" className="text-white text-decoration-none">
                FAQs
              </Link>
            </p>
            <p>
              <Link to="/contact" className="text-white text-decoration-none">
                Shipping & Returns
              </Link>
            </p>
          </div>

          {/* Cột 4 - Newsletter */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold">Newsletter</h5>
            <p>Subscribe to our newsletter for exclusive updates and offers.</p>
            <form className="d-flex" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="form-control me-2"
                placeholder="Your Email"
                required
              />
              <button className="btn btn-outline-light" type="submit">
                →
              </button>
            </form>
            <small className="d-block mt-2 text-secondary">
              By subscribing, you agree to our Privacy Policy.
            </small>
          </div>
        </div>

        <hr className="my-4" />

        {/* Bản quyền và thanh toán */}
        <div className="row align-items-center">
          <div className="col-md-6 col-lg-6">
            <p className="text-center text-md-start mb-0">
              © 2025 <strong>TigerVN</strong>. All rights reserved.
            </p>
          </div>

          <div className="col-md-6 col-lg-6 text-center text-md-end mt-3 mt-md-0">
            <img
              src="/images/visa.svg"
              alt="Visa"
              width="36"
              height="24"
              className="me-2"
              style={{ filter: "invert(1)" }}
            />
            <img
              src="/images/mastercard.svg"
              alt="MasterCard"
              width="36"
              height="24"
              className="me-2"
              style={{ filter: "invert(1)" }}
            />
            <img
              src="/images/paypal.svg"
              alt="PayPal"
              width="36"
              height="24"
              style={{ filter: "invert(1)" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

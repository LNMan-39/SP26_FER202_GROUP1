import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import "./Header.css";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Default avatar nếu không có photo
  const getAvatarSrc = () => {
    if (user?.photo) return user.photo;
    return isAdmin
      ? "/profile/profile_admin/default.jpg"
      : "/profile/profile_user/default.jpg";
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand
          onClick={handleLogoClick}
          className="navbar-brand-custom"
          style={{ cursor: "pointer" }}
        >
          <img
            src="/images/logo.jpg"
            alt="TigerVN Logo"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
          TigerVN
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>

            <Nav.Link as={Link} to="/cart">
              Cart <BiCart /> ({totalItems})
            </Nav.Link>

            {/* Dropdown cho Admin */}
            {isAdmin && (
              <NavDropdown
                title={
                  <span>
                    <img
                      src={getAvatarSrc()}
                      alt="Admin Avatar"
                      className="me-2"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        verticalAlign: "middle",
                      }}
                      onError={(e) => {
                        e.target.src = "/assets/default-user.jpg";
                      }}
                    />
                    Admin Panel
                  </span>
                }
                id="admin-dropdown"
                className="ms-2"
              >
                <NavDropdown.Item as={Link} to="/product-list">
                  Product List
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  All Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin-contacts">
                  Admin Messages
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* Dropdown cho User (authenticated, non-admin) */}
            {isAuthenticated && !isAdmin && (
              <NavDropdown
                title={
                  <span>
                    <img
                      src={getAvatarSrc()}
                      alt="User Avatar"
                      className="me-2"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        verticalAlign: "middle",
                      }}
                      onError={(e) => {
                        e.target.src = "/assets/default-user.jpg";
                      }}
                    />
                    Hi, {user.name}
                  </span>
                }
                id="user-dropdown"
                className="ms-2"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-messages">
                  My Messages
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <div className="d-flex align-items-center">
            <SearchBar />
            {/* Login button nổi bật kế SearchBar nếu chưa auth */}
            {!isAuthenticated && (
              <Button
                as={Link}
                to="/login"
                variant="warning"
                className="ms-3 rounded-pill px-4 py-2 fw-bold"
              >
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Alert,
  Modal,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getShoes } from "../services/api";
import { useCart } from "../context/CartContext";

const ShoeDetail = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const data = await getShoes();
        const selectedShoe = data.find((s) => s.id === id);
        if (selectedShoe) {
          if (selectedShoe.quantity <= 0) {
            setError("This product is out of stock.");
            setShoe(null);
          } else {
            setShoe(selectedShoe);
            // Set default size có qty >0
            const availableSize = Object.keys(selectedShoe.sizes || {}).find(
              (key) => selectedShoe.sizes[key] > 0
            );
            if (availableSize) setSelectedSize(availableSize);
          }
        } else {
          setError("Shoe not found.");
        }
      } catch (err) {
        setError("Failed to load shoe details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setModalMessage("Please select a size.");
      setShowQuantityModal(true);
      return;
    }
    const availableForSize = shoe.sizes[selectedSize] || 0;
    if (quantity > availableForSize) {
      setModalMessage(
        `Quantity for ${selectedSize} cannot exceed: ${availableForSize}. Please enter a valid number.`
      );
      setShowQuantityModal(true);
      return;
    }
    addToCart(shoe, selectedSize, quantity);
    alert("Added to cart!");
  };

  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value) || 1;
    const availableForSize = shoe.sizes[selectedSize] || 0;
    if (newQty > availableForSize) {
      setModalMessage(
        `Quantity for ${selectedSize} cannot exceed: ${availableForSize}. Please enter a valid number.`
      );
      setShowQuantityModal(true);
      return;
    }
    setQuantity(newQty);
  };

  const handleCloseModal = () => {
    setShowQuantityModal(false);
    setModalMessage("");
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );
  }

  if (error || !shoe) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">{error || "No shoe found"}</Alert>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  const formatPrice = (price) => Number(price).toLocaleString("vi-VN") + "₫";

  const availableSizes = Object.entries(shoe.sizes || {})
    .filter(([_, qty]) => qty > 0)
    .map(([size]) => size);

  return (
    <Container className="my-5">
      <Modal show={showQuantityModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Invalid Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-0">{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleCloseModal}>
            OK, I'll Adjust
          </Button>
        </Modal.Footer>
      </Modal>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="position-relative">
              <Card.Img
                variant="top"
                src={shoe.coverImage}
                alt={shoe.title}
                className="img-fluid"
                style={{
                  height: "500px",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              <Badge
                variant={
                  shoe.quantity > 5
                    ? "success"
                    : shoe.quantity > 0
                    ? "warning"
                    : "danger"
                }
                className="position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill"
                style={{ fontSize: "0.9rem" }}
              >
                {shoe.quantity > 0
                  ? `${shoe.quantity} In Stock`
                  : "Out of Stock"}
              </Badge>
            </div>
            <Card.Body className="p-4 bg-light">
              <Row>
                <Col md={8}>
                  <Card.Title className="h3 fw-bold mb-2 text-dark">
                    {shoe.title}
                  </Card.Title>
                  <Card.Subtitle className="h5 text-muted mb-3">
                    by {shoe.author}
                  </Card.Subtitle>
                  <div className="mb-4">
                    <span className="h2 text-danger fw-bold me-2">
                      {formatPrice(shoe.price)}
                    </span>
                  </div>
                  <Card.Text
                    className="text-secondary mb-3"
                    style={{ lineHeight: "1.6" }}
                  >
                    {shoe.description}
                  </Card.Text>
                  <Form className="mb-4">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Size</Form.Label>
                          <Form.Select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="rounded-pill py-2"
                            style={{ border: "2px solid #e9ecef" }}
                          >
                            <option value="">Select Size</option>
                            {availableSizes.map((size) => (
                              <option key={size} value={size}>
                                {size} ({shoe.sizes[size]} left)
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min={1}
                            max={shoe.sizes[selectedSize] || 0}
                            className="rounded-pill py-2 text-center"
                            style={{
                              border: "2px solid #e9ecef",
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                            }}
                          />
                          <Form.Text className="text-muted">
                            Available for selected size:{" "}
                            <Badge variant="info">
                              {shoe.sizes[selectedSize] || 0}
                            </Badge>
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col md={4} className="d-flex flex-column">
                  <div
                    className="border rounded p-3 bg-white mb-3"
                    style={{ height: "100%" }}
                  >
                    <h5 className="text-center mb-3">Quick Actions</h5>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        size="lg"
                        className="rounded-pill py-3 fw-bold shadow-sm"
                        onClick={handleAddToCart}
                        disabled={
                          !selectedSize ||
                          shoe.quantity <= 0 ||
                          quantity > (shoe.sizes[selectedSize] || 0)
                        }
                      >
                        <i className="bi bi-cart-plus me-2"></i>Add to Cart
                      </Button>
                      <Button
                        variant="primary"
                        size="lg"
                        className="rounded-pill py-3 fw-bold shadow-sm"
                        onClick={() => navigate(`/order/${shoe.id}`)}
                        disabled={shoe.quantity <= 0}
                      >
                        <i className="bi bi-lightning-charge me-2"></i>Buy Now
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="lg"
                        className="rounded-pill py-3"
                        onClick={() => navigate(-1)}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoeDetail;

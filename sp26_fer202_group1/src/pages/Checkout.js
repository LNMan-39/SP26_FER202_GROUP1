import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Table,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { getShoes } from "../services/api";
import { createOrder, updateShoeSizes } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();
  const { cart, clearCart, totalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please login to checkout.");
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    } else {
      setError("");
      if (user) {
        setFormData((prev) => ({ ...prev, name: user.name || prev.name }));
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || cart.length === 0) return;

    try {
      const shoesData = await getShoes();
      const errors = [];
      for (const item of cart) {
        const currentShoe = shoesData.find((s) => s.id === item.id);
        const availableForSize = currentShoe?.sizes?.[item.size] || 0;
        if (item.quantity > availableForSize) {
          errors.push(
            `${item.title} (${item.size}): Quantity exceeds stock (${availableForSize}).`
          );
        }
      }
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      const updatePromises = cart.map(async (item) => {
        const newOrder = {
          ...formData,
          product: item.title,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          size: item.size,
          userId: user.id,
          status: "pending",
          date: new Date().toLocaleString(),
        };
        await createOrder(newOrder);

        const currentShoe = shoesData.find((s) => s.id === item.id);
        if (currentShoe && currentShoe.sizes) {
          const newSizes = {
            ...currentShoe.sizes,
            [item.size]: (currentShoe.sizes[item.size] || 0) - item.quantity,
          };
          await updateShoeSizes(item.id, newSizes);
        }
      });

      await Promise.all(updatePromises);
      clearCart();
      navigate("/order-success");
    } catch (error) {
      setError("Failed to place orders. Please try again!");
      console.error("Checkout error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">{error || "Redirecting to login..."}</Alert>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h3>Cart is empty. Nothing to checkout.</h3>
        <Button onClick={() => navigate("/cart")}>Back to Cart</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h3 className="mb-4">Checkout - Order Details</h3>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {validationErrors.length > 0 && (
              <Alert
                variant="warning"
                dismissible
                onClose={() => setValidationErrors([])}
              >
                <ul className="mb-0">
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Full Name{" "}
                  {user && <small className="text-muted">(Pre-filled)</small>}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!!user}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" type="submit">
                  Place All Orders ({cart.length} items) - Total:{" "}
                  {totalPrice.toLocaleString("vi-VN")}₫
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h5>Order Summary</h5>
            <Table size="sm">
              <tbody>
                {cart.map((item) => (
                  <tr key={`${item.id}-${item.size}`}>
                    <td>{item.title}</td>
                    <td>
                      <Badge variant="info">{item.size}</Badge>
                    </td>
                    <td className="text-end">{item.quantity}x</td>
                    <td className="text-end">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr />
            <h6 className="text-end fw-bold">
              Grand Total: {totalPrice.toLocaleString("vi-VN")}₫
            </h6>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;

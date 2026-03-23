import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { getShoes } from "../services/api";
import { createOrder, updateShoeQuantity } from "../services/api"; // Thêm updateShoeQuantity
import { useAuth } from "../context/AuthContext";

const OrderForm = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchShoe = async () => {
      const data = await getShoes();
      const found = data.find((item) => item.id === id);
      if (found && found.quantity > 0) {
        // Chỉ load nếu còn hàng
        setShoe(found);
      } else {
        setError("Product out of stock or not found.");
        navigate("/"); // Redirect nếu hết hàng
      }
    };
    fetchShoe();
  }, [id, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({ ...prev, name: user.name || prev.name }));
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please login to place an order.");
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    } else {
      setError("");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      const numValue = parseInt(value) || 1;
      if (numValue > (shoe?.quantity || 0)) {
        setError(`Quantity cannot exceed available stock: ${shoe?.quantity}`);
        return;
      }
      setError(""); // Clear error nếu hợp lệ
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !shoe || formData.quantity > shoe.quantity) return;

    const orderedQuantity = parseInt(formData.quantity);
    const newOrder = {
      ...formData,
      product: shoe.title,
      price: shoe.price,
      total: shoe.price * orderedQuantity,
      userId: user.id,
      date: new Date().toLocaleString(),
    };

    try {
      // Tạo order
      await createOrder(newOrder);
      // Trừ kho
      const newStock = shoe.quantity - orderedQuantity;
      await updateShoeQuantity(id, newStock);
      // Cập nhật local state (optional, để UI sync nếu cần)
      setShoe((prev) => ({ ...prev, quantity: newStock }));
      navigate("/order-success");
    } catch (error) {
      setError("Failed to place order. Please try again!");
      console.error("Order error:", error);
    }
  };

  if (!shoe) return <Container className="my-5">Loading...</Container>;

  if (!isAuthenticated || shoe.quantity <= 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">Out of stock or login required.</Alert>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-sm border border-dark">
        <h3 className="text-center mb-4">Place Your Order - {shoe.title}</h3>
        {error && <Alert variant="danger">{error}</Alert>}
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
              rows={2}
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity (Available: {shoe.quantity})</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              min="1"
              max={shoe.quantity}
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              type="submit"
              disabled={formData.quantity > shoe.quantity}
            >
              Confirm Order
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default OrderForm;

import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Alert, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getShoes } from "../services/api";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState({}); // { id: { size: qty } }
  const [error, setError] = useState("");

  useEffect(() => {
    const syncStock = async () => {
      if (cart.length === 0) return;
      try {
        const shoesData = await getShoes();
        const stockMap = {};
        cart.forEach((item) => {
          const shoe = shoesData.find((s) => s.id === item.id);
          if (shoe && shoe.sizes) {
            stockMap[item.id] = {
              ...stockMap[item.id],
              [item.size]: shoe.sizes[item.size] || 0,
            };
          }
        });
        setStockData(stockMap);
      } catch (err) {
        console.error("Failed to sync stock:", err);
      }
    };
    syncStock();
  }, [cart]);

  const handleQuantityChange = (id, size, e) => {
    const newQty = parseInt(e.target.value) || 1;
    const available = stockData[id]?.[size] || 0;
    if (newQty > available) {
      setError(`Cannot exceed stock for ${size}: ${available}`);
      return;
    }
    setError("");
    updateQuantity(id, size, newQty);
  };

  const handleRemove = (id, size) => {
    if (window.confirm("Remove this item from cart?")) {
      removeFromCart(id, size);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  const handleClearCart = () => {
    if (window.confirm("Clear all items from cart?")) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h3>Your cart is empty</h3>
        <p className="text-muted">Add some shoes to get started!</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Cart ({cart.length} items)</h2>
        <Button variant="outline-danger" onClick={handleClearCart} size="sm">
          Clear Cart
        </Button>
      </div>

      {error && (
        <Alert variant="warning" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Table striped bordered hover responsive className="mb-4">
        <thead className="table-dark">
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            const available = stockData[item.id]?.[item.size] || 0;
            return (
              <tr key={`${item.id}-${item.size}`}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <div className="fw-bold">{item.title}</div>
                      <small className="text-muted">
                        Stock for {item.size}: {available}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge variant="info">{item.size}</Badge>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, item.size, e)
                    }
                    min="1"
                    max={available}
                    style={{ width: "80px", display: "inline-block" }}
                    className="me-2"
                  />
                  <small className="text-muted">/ {available} available</small>
                </td>
                <td>{Number(item.price).toLocaleString("vi-VN")}₫</td>
                <td className="fw-bold">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemove(item.id, item.size)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="table-light">
          <tr>
            <td colSpan="4" className="text-end fw-bold h5">
              Grand Total:
            </td>
            <td className="fw-bold h5 text-danger" colSpan="2">
              {totalPrice.toLocaleString("vi-VN")}₫
            </td>
          </tr>
        </tfoot>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <Button variant="secondary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
        <Button variant="success" size="lg" onClick={handleCheckout}>
          Proceed to Checkout <i className="bi bi-arrow-right ms-2"></i>
        </Button>
      </div>
    </Container>
  );
};

export default Cart;

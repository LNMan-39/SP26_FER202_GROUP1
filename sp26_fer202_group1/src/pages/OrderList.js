import { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate từ react-router-dom
import { getOrders, updateOrderStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState("");
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please login to view orders.");
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      let filtered = data;
      if (!isAdmin && user) {
        filtered = data.filter((order) => order.userId === user.id);
      }
      setOrders(filtered);
    } catch (err) {
      setError("Failed to load orders.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId) => {
    if (!updatingStatus) return;
    try {
      await updateOrderStatus(orderId, updatingStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: updatingStatus } : order
        )
      );
      alert("Status updated successfully!");
      setEditingId(null);
      setUpdatingStatus("");
    } catch (err) {
      setError("Failed to update status.");
      console.error(err);
    }
  };

  const statusOptions = ["pending", "approved", "shipping", "delivered"];

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "info",
      shipping: "primary",
      delivered: "success",
    };
    const labels = {
      pending: "Chờ Duyệt",
      approved: "Đã Duyệt",
      shipping: "Đang Giao",
      delivered: "Giao Thành Công",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading)
    return (
      <Container className="my-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );

  if (error && !isAdmin)
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (orders.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h3>{isAdmin ? "No orders yet." : "No orders yet."}</h3>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">
        {isAdmin ? "All Orders" : "My Orders"}
      </h3>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.date}</td>
              <td>{order.product}</td>
              <td>{order.size || "N/A"}</td>
              <td>{order.quantity}</td>
              <td>{Number(order.total).toLocaleString()}₫</td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{getStatusBadge(order.status || "pending")}</td>
              {isAdmin && (
                <td>
                  <Form.Select
                    value={
                      editingId === order.id
                        ? updatingStatus
                        : order.status || "pending"
                    }
                    onChange={(e) => {
                      if (editingId === order.id) {
                        setUpdatingStatus(e.target.value);
                      } else {
                        setEditingId(order.id);
                        setUpdatingStatus(e.target.value);
                      }
                    }}
                    size="sm"
                    className="me-1"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id)}
                    disabled={editingId !== order.id}
                  >
                    Update
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {!isAdmin && <Button onClick={() => navigate("/")}>Back to Home</Button>}
    </Container>
  );
};

export default OrderList;

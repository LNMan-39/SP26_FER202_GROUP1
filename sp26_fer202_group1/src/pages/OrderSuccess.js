import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center my-5">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>
        Thank you for shopping with <strong>TigerVN</strong>.
      </p>
      <Button variant="success" onClick={() => navigate("/orders")}>
        View My Orders
      </Button>
      <Button
        variant="secondary"
        className="ms-2"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default OrderSuccess;

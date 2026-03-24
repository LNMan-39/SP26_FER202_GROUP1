import { useEffect, useState } from "react";
import { Container, Table, Alert, Button, Badge } from "react-bootstrap";
import { getContacts } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchMessages();
  }, [isAuthenticated, navigate]);

  const fetchMessages = async () => {
    try {
      const data = await getContacts();
      const userMessages = data.filter(
        (msg) =>
          msg.userId === user.id || (!msg.userId && msg.email === user.email)
      ); // Filter own (userId or email if guest)
      setMessages(userMessages);
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Container className="my-5 text-center">
        <h3>Loading...</h3>
      </Container>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (messages.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h3>No messages yet.</h3>
        <Button onClick={() => navigate("/contact")}>Send a Message</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">My Messages</h3>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Subject/Message</th>
            <th>Status</th>
            <th>Reply from Admin</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.date || new Date().toLocaleString()}</td>
              <td>{msg.message.substring(0, 50)}...</td>
              <td>
                <Badge
                  variant={msg.status === "replied" ? "success" : "warning"}
                >
                  {msg.status || "unread"}
                </Badge>
              </td>
              <td>
                {msg.reply
                  ? msg.reply.substring(0, 50) + "..."
                  : "No reply yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => navigate("/contact")}>Send New Message</Button>
    </Container>
  );
};

export default MyMessages;

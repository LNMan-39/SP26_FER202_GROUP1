import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Alert,
  Button,
  Form,
  Modal,
  Badge,
} from "react-bootstrap";
import { getContacts, updateContact } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      setError("Access denied. Admin only.");
      setLoading(false);
      return;
    }
    fetchMessages();
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      const data = await getContacts();
      setMessages(data);
    } catch (err) {
      setError("Failed to load messages.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await updateContact(replyingId, { status: "replied", reply: replyText });
      setMessages(
        messages.map((msg) =>
          msg.id === replyingId
            ? { ...msg, status: "replied", reply: replyText }
            : msg
        )
      );
      alert("Reply sent successfully!");
      setShowReplyModal(false);
      setReplyText("");
      setReplyingId(null);
    } catch (err) {
      setError("Failed to send reply.");
      console.error(err);
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

  return (
    <Container className="my-5">
      <h3 className="text-center mb-4">Admin Messages</h3>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.date || new Date().toLocaleString()}</td>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.message.substring(0, 50)}...</td>
              <td>
                <Badge
                  variant={msg.status === "replied" ? "success" : "warning"}
                >
                  {msg.status || "unread"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setReplyingId(msg.id);
                    setReplyText(msg.reply || "");
                    setShowReplyModal(true);
                  }}
                >
                  {msg.status === "replied" ? "Edit Reply" : "Reply"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Reply */}
      <Modal
        show={showReplyModal}
        onHide={() => setShowReplyModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply to Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reply Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter your reply..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminContacts;

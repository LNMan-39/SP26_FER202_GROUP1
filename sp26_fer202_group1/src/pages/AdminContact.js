import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Table,
    Badge,
    Button,
    Modal,
    Form,
    Alert
} from "react-bootstrap";

function AdminContact() {

    const [contacts, setContacts] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [reply, setReply] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await axios.get("http://localhost:3002/contacts");
            setContacts(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load contacts");
        }
    };

    const openReply = (contact) => {
        setSelectedId(contact.id);
        setReply(contact.reply || "");
        setShow(true);
    };

    const handleReply = async () => {
        try {

            await axios.patch(`http://localhost:3002/contacts/${selectedId}`, {
                reply: reply,
                status: "replied"
            });

            fetchContacts();
            setShow(false);
            setReply("");

        } catch (err) {
            console.error(err);
            setError("Reply failed");
        }
    };

    return (
        <Container className="mt-4">

            <h3 className="mb-3">Contact Messages</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>

                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {contacts.map((c) => (

                        <tr key={c.id}>

                            <td>
                                {c.date ? new Date(c.date).toLocaleString() : "-"}
                            </td>

                            <td>{c.name}</td>

                            <td>{c.email}</td>

                            <td>{c.message}</td>

                            <td>
                                <Badge bg={c.status === "replied" ? "success" : "warning"}>
                                    {c.status || "unread"}
                                </Badge>
                            </td>

                            <td>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => openReply(c)}
                                >
                                    Reply
                                </Button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </Table>

            {/* Reply Modal */}

            <Modal show={show} onHide={() => setShow(false)}>

                <Modal.Header closeButton>
                    <Modal.Title>Reply Message</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group>
                        <Form.Label>Reply</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>

                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancel
                    </Button>

                    <Button variant="primary" onClick={handleReply}>
                        Send Reply
                    </Button>

                </Modal.Footer>

            </Modal>

        </Container>
    );
}

export default AdminContact;
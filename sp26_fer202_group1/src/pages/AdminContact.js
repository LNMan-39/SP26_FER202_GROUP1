import axios from "axios";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container } from "react-bootstrap";


function AdminContact() {
    const [contacts, setContact] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3002/contacts")
            .then(res => {
                setContact(res.data);


            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <Container>
            {contacts.map((c) => (
                <Card key={c.id} className="mb-3">
                    <Card.Body>
                        <Card.Text>Name: {c.name}</Card.Text>
                        <Card.Text>Email: {c.email}</Card.Text>
                        <Card.Text>Message: {c.message}</Card.Text>
                    </Card.Body>

                </Card>
            ))}
        </Container>
    );

}
export default AdminContact;

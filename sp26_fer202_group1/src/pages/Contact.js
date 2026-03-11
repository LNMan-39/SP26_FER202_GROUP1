
import React from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

function Contact() {

    const [validated, setValidated] = React.useState(false);

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {

            await axios.post("http://localhost:3002/contacts", formData);

            alert("Contact submitted successfully!");

            setFormData({
                name: "",
                email: "",
                message: ""
            });
        }

        setValidated(true);
    };

    const handleReset = () => {
        setFormData({
            name: "",
            email: "",
            message: ""
        });
        setValidated(false);
    };

    return (
        <div className="contact">
            <h2>Contact Us</h2>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                    />
                </Form.Group>

                <Button type="submit" className="m-2">Submit</Button>

                <Button type="button" variant="secondary" onClick={handleReset}>
                    Reset
                </Button>

            </Form>

        </div>
    );
}

export default Contact;


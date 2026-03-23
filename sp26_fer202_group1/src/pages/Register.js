import React from "react";
import { useState } from "react";
import {
    Container,
    Form,
    Button,
    Alert,
    Card,
    FormFloating,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { createUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError("");
            const userData = { ...data, role: "customer" };
            const newUser = await createUser(userData);
            login(newUser);
            navigate("/");
        } catch (error) {
            console.error("Registration error details:", error);
            if (error.response?.status === 400 || error.response?.status === 409) {
                setError("Email already exists. Try a different one or login.");
            } else if (
                error.code === "ERR_NETWORK" ||
                error.message.includes("Network Error")
            ) {
                setError(
                    'Backend server not running. Start "npm run json-server" and try again.'
                );
            } else {
                setError(`Registration failed: ${error.message || "Unknown error"}`);
            }
        }
    };

    const handleReset = () => {
        reset();
        setError("");
    };

    return (
        <div className="register-bg">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="register-card shadow-lg border-0">
                    <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                            <h3 className="register-title mb-3">Create Account</h3>
                            <p className="text-muted">Join us today and start shopping!</p>
                        </div>
                        {error && (
                            <Alert variant="danger" className="rounded-3">
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit(onSubmit)} className="register-form">
                            <Form.Group className="mb-4 position-relative">
                                <FiUser className="input-icon" />
                                <FormFloating>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        isInvalid={!!errors.name}
                                        {...register("name", { required: "Name is required" })}
                                        className="input-field"
                                    />
                                    <Form.Label>Full Name</Form.Label>
                                </FormFloating>
                                <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-4 position-relative">
                                <FiMail className="input-icon" />
                                <FormFloating>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        isInvalid={!!errors.email}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Invalid email",
                                            },
                                        })}
                                        className="input-field"
                                    />
                                    <Form.Label>Email</Form.Label>
                                </FormFloating>
                                <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-4 position-relative">
                                <FiLock className="input-icon" />
                                <FormFloating>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password (min 6 chars)"
                                        isInvalid={!!errors.password}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Min 6 characters" },
                                        })}
                                        className="input-field"
                                    />
                                    <Form.Label>Password</Form.Label>
                                </FormFloating>
                                <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 register-btn rounded-3 fw-bold py-3"
                            >
                                Sign Up
                            </Button>
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={handleReset}
                                className="w-100 mt-2 rounded-3 py-2"
                            >
                                Reset Form
                            </Button>
                        </Form>
                        <div className="mt-4">
                            <p className="text-center text-white mb-0">
                                Already have an account?{" "}
                                <Link to="/login" className="text-warning fw-bold">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Register;

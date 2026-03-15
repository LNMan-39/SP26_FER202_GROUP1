import React, { useState } from "react";
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
import { FiMail, FiLock } from "react-icons/fi";
import { getUsers, loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError("");
            const users = await getUsers();
            const user = users.find(
                (u) => u.email === data.email && u.password === data.password
            );
            if (user) {
                await loginUser(user.id, { lastLogin: new Date().toISOString() });
                login(user);
                navigate("/");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Login failed");
        }
    };

    return (
        <div className="login-bg">
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Card className="login-card shadow-lg border-0">
                    <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                            <h3 className="login-title mb-3">Welcome Back</h3>
                            <p className="text-muted">Sign in to your account</p>
                        </div>
                        {error && (
                            <Alert variant="warning" className="rounded-3">
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit(onSubmit)} className="login-form">
                            <Form.Group className="mb-4 position-relative">
                                <FiMail className="input-icon" />
                                <FormFloating>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        isInvalid={!!errors.email}
                                        {...register("email", { required: "Email is required" })}
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
                                        placeholder="Enter your password"
                                        isInvalid={!!errors.password}
                                        {...register("password", {
                                            required: "Password is required",
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
                                className="w-100 login-btn rounded-3 fw-bold py-3"
                            >
                                Sign In
                            </Button>
                        </Form>
                        <div className="mt-4">
                            <p className="text-center text-white mb-0">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-warning fw-bold">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;

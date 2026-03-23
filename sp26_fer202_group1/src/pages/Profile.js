import { useEffect, useState } from "react";
import {
    Container,
    Form,
    Button,
    Alert,
    Card,
    Row,
    Col,
    Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        address: "",
        photo: "",
    });
    const [previewPhoto, setPreviewPhoto] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, login, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || "",
                email: user.email || "",
                address: user.address || "",
                photo: user.photo || getDefaultPhoto(),
            });
            setPreviewPhoto(user.photo || getDefaultPhoto());
        }
    }, [user]);

    // Hàm lấy default photo path dựa trên role
    const getDefaultPhoto = () => {
        return isAdmin
            ? "/profile/profile_admin/default.jpg"
            : "/profile/profile_user/default.jpg";
    };

    // Hàm tạo path cho upload
    const getUploadPhotoPath = (fileName) => {
        const ext = fileName.split(".").pop();
        const basePath = isAdmin
            ? "/profile/profile_admin/"
            : "/profile/profile_user/";
        return `${basePath}user-${user.id}.${ext}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewPhoto(event.target.result);
            };
            reader.readAsDataURL(file);
            setUserData((prev) => ({
                ...prev,
                photo: getUploadPhotoPath(file.name),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const updatedUser = await updateUser(user.id, userData);
            login(updatedUser); // Update local auth state
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Failed to update profile. Email must be unique.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="warning">Please login to view profile.</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">User Profile</h2>
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}
            <Card className="shadow-sm">
                <Card.Body className="p-4">
                    <Row>
                        <Col md={4} className="text-center mb-3">
                            <Image
                                src={previewPhoto}
                                roundedCircle
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                onError={(e) => {
                                    e.target.src = getDefaultPhoto();
                                }}
                            />
                            <Form.Group className="mt-3">
                                <Form.Label>Profile Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                                {isAdmin && ( // Chỉ hiển thị instruction cho admin
                                    <Form.Text className="text-muted">
                                        Upload and copy to public/profile/profile_admin/ for
                                        display.
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={8}>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={userData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                onChange={handleChange}
                                                disabled
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Email cannot be changed for security.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="address"
                                        rows={2}
                                        value={userData.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? "Updating..." : "Update Profile"}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;

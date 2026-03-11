import { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getShoes, updateShoe } from "../services/api";

const EditShoe = () => {
    const { id } = useParams();
    const [shoe, setShoe] = useState({
        title: "",
        author: "",
        coverImage: "",
        description: "",
        price: "",
        quantity: 0,
        category: "",
        sizes: {},
    });
    const [previewImage, setPreviewImage] = useState("");
    const [error, setError] = useState(null);
    const [newSizeKey, setNewSizeKey] = useState("US 5");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShoe = async () => {
            try {
                const data = await getShoes();
                const selectedShoe = data.find((s) => s.id === id);
                if (selectedShoe) {
                    setShoe(selectedShoe);
                    setPreviewImage(selectedShoe.coverImage);
                } else {
                    setError("Shoe not found.");
                }
            } catch (err) {
                setError("Failed to load shoe details.");
                console.error(err);
            }
        };
        fetchShoe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShoe((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setPreviewImage(event.target.result);
            reader.readAsDataURL(file);
            setShoe((prev) => ({ ...prev, coverImage: `/assets/${file.name}` }));
        }
    };

    // Thêm size mới (tương tự AddShoe)
    const addSize = () => {
        if (newSizeKey && !shoe.sizes[newSizeKey]) {
            setShoe((prev) => ({
                ...prev,
                sizes: { ...prev.sizes, [newSizeKey]: 1 },
                quantity: Object.values({ ...prev.sizes, [newSizeKey]: 1 }).reduce(
                    (a, b) => a + b,
                    0
                ),
            }));
            setNewSizeKey("US 5");
        }
    };

    const updateSizeQty = (sizeKey, value) => {
        const numValue = parseInt(value) || 0;
        setShoe((prev) => {
            const newSizes = { ...prev.sizes, [sizeKey]: numValue };
            return {
                ...prev,
                sizes: newSizes,
                quantity: Object.values(newSizes).reduce((a, b) => a + b, 0),
            };
        });
    };

    const removeSize = (sizeKey) => {
        setShoe((prev) => {
            const newSizes = { ...prev.sizes };
            delete newSizes[sizeKey];
            return {
                ...prev,
                sizes: newSizes,
                quantity: Object.values(newSizes).reduce((a, b) => a + b, 0),
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const allShoes = await getShoes();
            const isDuplicateTitle = allShoes.some(
                (s) => s.title.toLowerCase() === shoe.title.toLowerCase() && s.id !== id
            );
            if (isDuplicateTitle) {
                setError("A shoe with this title already exists.");
                return;
            }
            if (Object.keys(shoe.sizes).length === 0) {
                setError("Please add at least one size.");
                return;
            }
            const shoeToSubmit = {
                ...shoe,
                price: shoe.price ? parseFloat(shoe.price) : 0,
                quantity: shoe.quantity || 0,
            };
            await updateShoe(id, shoeToSubmit);
            alert("Shoe updated successfully!");
            navigate("/product-list");
        } catch (err) {
            setError("Failed to update shoe. Please try again.");
            console.error(err);
        }
    };

    const sizeOptions = [
        "US 5",
        "US 5.5",
        "US 6",
        "US 6.5",
        "US 7",
        "US 7.5",
        "US 8",
        "US 8.5",
        "US 9",
        "US 9.5",
        "US 10",
        "US 11",
        "US 12",
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Container className="my-5 flex-grow-1">
                <h2>Edit Shoe</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={shoe.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="author">
                        <Form.Label>Author / Brand</Form.Label>
                        <Form.Control
                            type="text"
                            name="author"
                            value={shoe.author}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="coverImage">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                        )}
                        <Form.Text>Copy to public/assets/ for display.</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            name="category"
                            value={shoe.category}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={shoe.price}
                            onChange={handleChange}
                            min="0"
                            step="1000"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={3}
                            value={shoe.description}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="sizes">
                        <Form.Label>
                            Sizes & Quantities (Total Qty: {shoe.quantity})
                        </Form.Label>
                        <div className="mb-2">
                            {Object.entries(shoe.sizes).map(([sizeKey, qty]) => (
                                <div key={sizeKey} className="d-flex align-items-center mb-2">
                                    <Form.Control
                                        type="text"
                                        value={sizeKey}
                                        className="me-2"
                                        style={{ width: "100px" }}
                                        readOnly
                                    />
                                    <Form.Control
                                        type="number"
                                        value={qty}
                                        min="0"
                                        onChange={(e) => updateSizeQty(sizeKey, e.target.value)}
                                        className="me-2"
                                        style={{ width: "80px" }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeSize(sizeKey)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex gap-2 mb-2">
                            <Form.Select
                                value={newSizeKey}
                                onChange={(e) => setNewSizeKey(e.target.value)}
                                style={{ width: "120px" }}
                            >
                                {sizeOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control
                                type="number"
                                placeholder="Qty"
                                min="0"
                                style={{ width: "80px" }}
                            />
                            <Button variant="secondary" onClick={addSize}>
                                Add Size
                            </Button>
                        </div>
                        <Form.Text>
                            Add sizes from US 5 to US 12. Total quantity auto-calculated.
                        </Form.Text>
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit">
                            Update Shoe
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default EditShoe;

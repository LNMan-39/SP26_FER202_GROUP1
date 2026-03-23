import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImageCarousel from "../components/Carousel";
import { getShoes } from "../services/api";

const Home = () => {
    const [shoes, setShoes] = useState([]);
    const [filters, setFilters] = useState({ price: [], brand: [], size: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const shoesPerPage = 6;

    const priceRanges = [
        { label: "0-1000000", min: 0, max: 1000000 },
        { label: "1000000-3000000", min: 1000000, max: 3000000 },
        { label: "3000000-5000000", min: 3000000, max: 5000000 },
        { label: "5000000+", min: 5000000, max: Infinity },
    ];

    useEffect(() => {
        getShoes().then((data) =>
            setShoes(data.filter((shoe) => shoe.quantity > 0))
        );
    }, []);

    const handleFilterChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            [type]: prev[type].includes(value)
                ? prev[type].filter((item) => item !== value)
                : [...prev[type], value],
        }));
        setCurrentPage(1);
    };

    const filteredShoes = shoes.filter((shoe) => {
        const price = Number(shoe.price);

        // Price filter
        if (filters.price.length) {
            const matchPrice = filters.price.some((label) => {
                const range = priceRanges.find((r) => r.label === label);
                return price >= range.min && price <= range.max;
            });
            if (!matchPrice) return false;
        }

        // Brand filter
        if (filters.brand.length && !filters.brand.includes(shoe.author))
            return false;

        // Size filter
        if (filters.size.length) {
            const matchSize = filters.size.some((sz) => shoe.sizes[sz] > 0);
            if (!matchSize) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredShoes.length / shoesPerPage);
    const paginatedShoes = filteredShoes.slice(
        (currentPage - 1) * shoesPerPage,
        currentPage * shoesPerPage
    );

    const renderPagination = () => (
        <div className="d-flex justify-content-center mt-4">
            <Pagination>
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                        key={i}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );

    const availableBrands = [...new Set(shoes.map((shoe) => shoe.author))];

    // Sắp xếp Size theo số thực
    const availableSizes = [
        ...new Set(
            shoes.flatMap((shoe) =>
                Object.keys(shoe.sizes || {}).filter((key) => shoe.sizes[key] > 0)
            )
        ),
    ].sort((a, b) => {
        const numA = parseFloat(a.replace("US ", ""));
        const numB = parseFloat(b.replace("US ", ""));
        return numA - numB;
    });

    const renderFilterGroup = (label, options, type) => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            {options.map((opt) => (
                <Form.Check
                    key={opt}
                    type="checkbox"
                    label={opt}
                    checked={filters[type].includes(opt)}
                    onChange={() => handleFilterChange(type, opt)}
                />
            ))}
        </Form.Group>
    );

    return (
        <div>
            <ImageCarousel />
            <Container className="my-5">
                <Row>
                    <Col md={3}>
                        <h5>Filters</h5>
                        <Form>
                            {renderFilterGroup(
                                "Price Range",
                                priceRanges.map((r) => r.label),
                                "price"
                            )}
                            {renderFilterGroup("Brand", availableBrands, "brand")}
                            <Form.Group className="mb-3">
                                <Form.Label>Size</Form.Label>
                                <Row>
                                    {availableSizes.map((sz) => (
                                        <Col xs={6} key={sz}>
                                            <Form.Check
                                                type="checkbox"
                                                label={sz}
                                                checked={filters.size.includes(sz)}
                                                onChange={() => handleFilterChange("size", sz)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col md={9}>
                        <h2 className="mb-4">Featured Shoes</h2>
                        <Row>
                            {paginatedShoes.length > 0 ? (
                                paginatedShoes.map((shoe) => (
                                    <Col
                                        key={shoe.id}
                                        xs={12}
                                        sm={6}
                                        md={6}
                                        lg={4}
                                        className="mb-4"
                                    >
                                        <Card className="h-100 shadow-sm">
                                            <Card.Img
                                                variant="top"
                                                src={shoe.coverImage}
                                                alt={shoe.title}
                                                style={{ height: "300px", objectFit: "cover" }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{shoe.title}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {shoe.author}
                                                </Card.Subtitle>
                                                <Card.Text className="text-danger fw-semibold">
                                                    {Number(shoe.price).toLocaleString("vi-VN")}₫
                                                </Card.Text>
                                                <Link
                                                    to={`/shoe-detail/${shoe.id}`}
                                                    className="btn btn-primary mt-2"
                                                >
                                                    View Details
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No shoes found.</p>
                            )}
                        </Row>
                        {totalPages > 1 && renderPagination()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;

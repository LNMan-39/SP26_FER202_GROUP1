import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Card, Col, Row, Alert, Button } from "react-bootstrap";
import { getShoes } from "../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const data = await getShoes();
        setShoes(data.filter((shoe) => shoe.quantity > 0));
      } catch (error) {
        console.error("Error fetching shoes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredShoes([]);
      return;
    }
    const safeQuery = query.toLowerCase().trim();
    const queryWords = safeQuery.split(/\s+/).filter((word) => word.length > 0);

    const filtered = shoes.filter((shoe) => {
      const titleLower = shoe.title?.toLowerCase() || "";
      return queryWords.some((word) => titleLower.includes(word));
    });
    setFilteredShoes(filtered);
  }, [query, shoes]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h3>Searching...</h3>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Search Results for "{query}" ({filteredShoes.length} found)
        </h2>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
      {query.trim() === "" && (
        <Alert variant="info">Enter a keyword to search.</Alert>
      )}
      {filteredShoes.length === 0 && query.trim() !== "" && (
        <Alert variant="warning">
          No results found for "{query}". Try different keywords.
        </Alert>
      )}
      <Row>
        {filteredShoes.map((shoe) => (
          <Col key={shoe.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={shoe.coverImage}
                alt={shoe.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title className="h6">{shoe.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  {shoe.author}
                </Card.Subtitle>
                <Card.Text className="text-danger fw-bold">
                  {Number(shoe.price).toLocaleString("vi-VN")}₫
                </Card.Text>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/shoe-detail/${shoe.id}`)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchResults;

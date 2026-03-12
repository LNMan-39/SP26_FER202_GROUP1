import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Image,
  Pagination,
  Row,
  Table,
  Badge,
} from "react-bootstrap";
import { BiCategory, BiMenu } from "react-icons/bi";
import { Link } from "react-router-dom";
import { deleteShoe, getShoes } from "../services/api";

const ProductList = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("list");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this shoe?")) {
      try {
        await deleteShoe(id);
        setShoes(shoes.filter((shoe) => shoe.id !== id));
        alert("Shoe deleted successfully!");
      } catch (error) {
        console.error("Failed to delete shoe", error);
        alert("Failed to delete shoe!");
      }
    }
  };

  useEffect(() => {
    fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      const data = await getShoes();
      setShoes(data); // Admin xem tất cả, kể cả quantity=0
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(shoes.length / itemsPerPage);
  const paginatedShoes = shoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              {itemsPerPage} products
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[5, 10, 20, 30].map((num) => (
                <Dropdown.Item
                  key={num}
                  onClick={() => {
                    setItemsPerPage(num);
                    setCurrentPage(1);
                  }}
                >
                  {num} products
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            variant="secondary"
            onClick={() =>
              setViewType(viewType === "list" ? "card" : "list")
            }
          >
            {viewType === "list" ? <BiCategory /> : <BiMenu />}
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shoe List</h2>
        <Button variant="success" as={Link} to="/add-shoe">
          Add Shoe
        </Button>
      </div>
      {viewType === "list" ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Image</th>
              <th>Price</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShoes.map((shoe) => (
              <tr key={shoe.id}>
                <td>{shoe.id}</td>
                <td>{shoe.title}</td>
                <td>{shoe.author}</td>
                <td>
                  <Image
                    src={shoe.coverImage}
                    alt={shoe.title}
                    thumbnail
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{shoe.price}đ</td>
                <td style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {shoe.description}
                </td>
                <td>
                  {shoe.quantity > 0 ? shoe.quantity : <Badge variant="danger">Out of Stock</Badge>}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    as={Link}
                    to={`/edit-shoe/${shoe.id}`}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(shoe.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Row>
          {paginatedShoes.map((shoe) => (
            <Col md={3} sm={6} xs={12} key={shoe.id} className="mb-4">
              <Card className="h-100 d-flex flex-column">
                <Card.Img
                  variant="top"
                  src={shoe.coverImage}
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <Card.Title>{shoe.title}</Card.Title>
                  <Card.Text>Brand: {shoe.author}</Card.Text>
                  <Card.Text>Price: {shoe.price}đ</Card.Text>
                  <Card.Text>
                    Quantity: {shoe.quantity > 0 ? shoe.quantity : <Badge variant="danger">Out of Stock</Badge>}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="warning"
                      size="sm"
                      as={Link}
                      to={`/edit-shoe/${shoe.id}`}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(shoe.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Pagination className="mt-4 justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        {[...Array(totalPages).keys()].slice(0, 5).map((num) => (
          <Pagination.Item
            key={num + 1}
            active={currentPage === num + 1}
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
        {totalPages > 5 && <Pagination.Ellipsis />}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      </Pagination>
    </Container>
  );
};

export default ProductList;
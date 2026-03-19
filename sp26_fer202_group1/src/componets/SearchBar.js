import { useEffect, useState } from "react";
import { Button, Form, FormControl, Image, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getShoes } from "../services/api";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const data = await getShoes();
        setShoes(data);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    };
    fetchShoes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredShoes([]);
      setShowDropdown(false);
    } else {
      const safeQuery = searchQuery.toLowerCase().trim();
      const queryWords = safeQuery
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const filtered = shoes.filter((shoe) => {
        const titleLower = shoe.title?.toLowerCase() || "";
        return queryWords.some((word) => titleLower.includes(word));
      });
      setFilteredShoes(filtered);
      setShowDropdown(true); // Hiện dropdown khi có kết quả
    }
  }, [searchQuery, shoes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false); // Ẩn dropdown sau khi submit
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-bar-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="search-bar-container position-relative"
      style={{ zIndex: 1050 }}
    >
      <Form onSubmit={handleSearchSubmit} className="d-flex">
        <FormControl
          type="search"
          placeholder="Search shoes..."
          className="me-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => filteredShoes.length > 0 && setShowDropdown(true)}
        />
        <Button variant="outline-light" type="submit">
          Search
        </Button>
      </Form>

      {showDropdown && filteredShoes.length > 0 && (
        <ListGroup
          className="position-absolute bg-white w-100 shadow mt-2"
          style={{
            top: "100%",
            left: 0,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {filteredShoes.slice(0, 5).map((shoe) => (
            <ListGroup.Item
              key={shoe.id}
              className="d-flex align-items-center p-3 border-0"
              action
              onClick={() => {
                setShowDropdown(false);
                setSearchQuery("");
                navigate(`/shoe-detail/${shoe.id}`);
              }}
            >
              <Image
                src={shoe.coverImage}
                alt={shoe.title}
                width={40}
                height={50}
                className="me-2 rounded"
                style={{ objectFit: "cover" }}
              />
              <div>
                <div className="fw-bold">{shoe.title}</div>
                <small className="text-muted">
                  {shoe.author} - {Number(shoe.price).toLocaleString("vi-VN")}₫
                </small>
              </div>
            </ListGroup.Item>
          ))}
          {filteredShoes.length > 5 && (
            <ListGroup.Item className="text-center text-muted border-0">
              And {filteredShoes.length - 5} more results...
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchBar;

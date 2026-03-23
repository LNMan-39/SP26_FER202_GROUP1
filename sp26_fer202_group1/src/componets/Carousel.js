import { Carousel } from "react-bootstrap";
import "./Carousel.css";

const ImageCarousel = () => {
  return (
    <Carousel className="carousel" fade interval={3000} pause="hover">
      {" "}
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/images/Banners_Onitsuka.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/images/onitsukatiger2.jpg"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-image"
          src="/images/onitsukatiger3.jpg"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default ImageCarousel;

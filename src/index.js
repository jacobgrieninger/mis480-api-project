import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { searchPhoto } from "./requests";
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Button,
} from "reactstrap";

const Main = () => {
  const [imgURL, setImgURL] = useState("");

  return (
    <Fragment>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>Jacob Grieninger</h2>
        <h4>MIS480 - 2022 - API Prototype</h4>
      </div>
      <ImageSelection setImgURL={setImgURL} />
      <DisplayOCR />
    </Fragment>
  );
};

const ImageSelection = (props) => {
  const [search, setSearch] = useState({ go: false, term: "" });
  const [results, setResults] = useState([]);

  const PhotoDisplay = () => {
    useEffect(() => {
      async function loadImgs() {
        if (search.go) {
          let res = await searchPhoto(search.term);
          setResults(res.results);
          setSearch({ ...search, go: false });
        }
      }
      loadImgs();
    }, [search]);

    let imgList = [];

    if (results.length !== 0) {
      results.forEach((res) => {
        imgList.push(
          <Col key={res.id}>
            <img
              className="img-fluid shadow mb-5 bg-body rounded"
              src={res.urls.regular}
              alt={res.alt_description}
              onClick={function () {
                props.setImgURL(res.urls.regular);
                setResults([]);
              }}
            />
          </Col>
        );
      });
    }

    return (
      <Container>
        <Row xs="5">{imgList}</Row>
      </Container>
    );
  };

  return (
    <Container className="segment" fluid="sm" style={{ textAlign: "center" }}>
      <h5>Select Image Source</h5>
      <Row>
        <Col />
        <Col>
          <InputGroup>
            <Input
              placeholder="Paste image URL"
              onChange={function (e) {
                props.setImgURL(e.target.value);
              }}
            />
            <InputGroupText>
              <i className="bi bi-card-image"></i>
            </InputGroupText>
          </InputGroup>
        </Col>
        <Col />
      </Row>
      Or
      <Row>
        <Col />
        <Col>
          <InputGroup>
            <Input
              placeholder="Search for an image"
              onChange={function (e) {
                setSearch({ ...search, term: e.target.value });
              }}
            />
            <Button
              color="secondary"
              outline={true}
              onClick={function () {
                setSearch({ ...search, go: true });
              }}
            >
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col />
      </Row>
      <PhotoDisplay />
    </Container>
  );
};

const DisplayOCR = (props) => {
  return (
    <Fragment>
      <Container className="segment" style={{ textAlign: "center" }}>
        <Row>
          <Col />
          <Col>
            <Button>Go!</Button>
          </Col>
          <Col />
        </Row>
      </Container>
    </Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);

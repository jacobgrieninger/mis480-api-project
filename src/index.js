import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { searchPhoto, OCR } from "./requests";
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Button,
  Spinner,
  Alert,
  Collapse,
  Card,
  CardBody,
  List,
} from "reactstrap";

const Main = () => {
  const [imgURL, setImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>Jacob Grieninger</h2>
        <h4>MIS480 - 2022 - API Prototype</h4>
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Button
          color="secondary"
          outline={true}
          size="sm"
          onClick={function () {
            setIsOpen(!isOpen);
          }}
          style={{ marginBottom: "1rem" }}
        >
          About
        </Button>
        <Container>
          <Row>
            <Col />
            <Col xs="6">
              <Collapse isOpen={isOpen}>
                <Card>
                  <CardBody>
                    A small web app to prototype the use of APIs.
                    <br />
                    APIs used:
                    <List
                      style={{
                        textAlign: "start",
                        width: "50%",
                        margin: "auto",
                      }}
                    >
                      <li>
                        <a
                          target="blank"
                          href="https://unsplash.com/developers"
                        >
                          Unsplash
                        </a>
                        (photos)
                      </li>
                      <li>
                        <a target="blank" href="https://ocr.space/ocrapi">
                          OCR
                        </a>
                        (optical character recognition)
                      </li>
                    </List>
                    <br />
                    View the source code for this project:
                    <h2>
                      <a
                        target="blank"
                        href="https://github.com/jacobgrieninger/mis480-api-project"
                      >
                        <i class="bi bi-github"></i>
                      </a>
                    </h2>
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
            <Col />
          </Row>
        </Container>
      </div>

      <br />
      <ImageSelection setImgURL={setImgURL} />
      <DisplayOCR imgURL={imgURL} />
    </Fragment>
  );
};

const ImageSelection = (props) => {
  const [search, setSearch] = useState({ go: false, term: "" });
  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState(false);

  const PhotoDisplay = () => {
    useEffect(() => {
      async function loadImgs() {
        if (search.go) {
          let res = await searchPhoto(search.term);
          setResults(res.results);
          console.log(res);
          setSearch({ ...search, go: false });
        }
      }
      loadImgs();
      // eslint-disable-next-line
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
                props.setImgURL(res.urls.small);
                setResults([]);
                setSearch({ ...search, term: "" });
                setAlert(true);
              }}
            />
          </Col>
        );
      });
    }

    return (
      <Container>
        <Row xs="6">{imgList}</Row>
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
              value={search.term}
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
      <br />
      <Row>
        <Col />
        <Col
          className={` ${alert ? "alert-shown" : "alert-hidden"}`}
          onTransitionEnd={() => setAlert(false)}
        >
          <Alert color="success">Image Selected!</Alert>
        </Col>
        <Col />
      </Row>
      <br />
      <PhotoDisplay />
    </Container>
  );
};

const DisplayOCR = (props) => {
  const [parse, setParse] = useState("");
  const [displayType, setDisplayType] = useState("none");

  const OutputResult = () => {
    let payload = <Fragment />;
    if (displayType === "none") {
      return;
    } else if (displayType === "loading") {
      payload = <Spinner />;
    } else if (displayType === "error") {
      payload = (
        <Alert color="danger" style={{ textAlign: "start" }}>
          {parse}
        </Alert>
      );
    } else if (displayType === "valid") {
      payload = (
        <Card className="shadow rounded">
          <CardBody>{parse}</CardBody>
        </Card>
      );
    }

    return payload;
  };

  const DefaultImage = () => {
    let payload = "";
    if (props.imgURL === "") {
      payload = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          fill="currentColor"
          class="bi bi-image"
          viewBox="0 0 16 16"
        >
          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
        </svg>
      );
    } else {
      payload = (
        <img
          className="shadow rounded thumb"
          src={props.imgURL}
          alt="Selected"
        />
      );
    }
    return payload;
  };

  return (
    <Fragment>
      <Container className="segment-reverse" style={{ textAlign: "center" }}>
        <Row>
          <Col />
          <Col>
            <Button
              color="success"
              outline={true}
              onClick={async function () {
                setDisplayType("loading");
                let res = await OCR(props.imgURL);
                console.log(res);
                if (res.hasOwnProperty("ErrorMessage")) {
                  let payload = "";
                  res.ErrorMessage.forEach((message) => {
                    payload += "- " + message + "\n";
                  });
                  setParse(payload);
                  setDisplayType("error");
                } else if (res.hasOwnProperty("ParsedResults")) {
                  if (res.ParsedResults[0].ParsedText === "") {
                    setParse("Empty result, likely unable to read image.");
                    setDisplayType("error");
                  } else {
                    setParse(res.ParsedResults[0].ParsedText);
                    setDisplayType("valid");
                  }
                } else {
                  setParse("Result has neither a valid response nor error.");
                }
              }}
            >
              Go!
            </Button>
          </Col>
          <Col />
        </Row>
        <br />
        <Row>
          <Col />
          <Col>
            <h4>Selected Image:</h4>
            <DefaultImage />
          </Col>
          <Col>
            <h4>Parsed Text:</h4> <OutputResult />
          </Col>
          <Col />
        </Row>
      </Container>
    </Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Editable = ({ children }) => {
    const item = children;
    return (
        <>
            <Row>
                <Col className="text-right" xs="5">
                    Name
            </Col>
                <Col>
                    {item.name}
                </Col>
            </Row>
            <hr style={{ marginTop: "0.2rem", marginBottom: "0.2rem" }} />
            <Row>
                <Col className="text-right" xs="5">
                    Quantity
            </Col>
                <Col>
                    {item.quantity}
                </Col>
            </Row>
            <hr style={{ marginTop: "0.2rem", marginBottom: "0.2em" }} />
            <Row>
                <Col className="text-right" xs="5">
                    Description
            </Col>
                <Col>
                    {item.description.split("\n").map(
                        i => <span style={{ display: "block" }}>
                            {i}
                        </span>
                    )}
                </Col>
            </Row>
        </>
    )
};

export default Editable;
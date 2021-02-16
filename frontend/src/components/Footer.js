import { useDispatch } from "react-redux";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

import {
    setCachedPassword,
    setCurrentCode,
    setPasswordFor
} from "../features/auth/authSlice";

import {
    resetBag
} from "../features/bag/bagSlice";


import "./footer.css"

const Footer = () => {
    const dispatch = useDispatch();
    return (
        <footer className="footer"
            style={{
                position: "relative",
                bottom: 0,
                width: "100%",
                height: "80px",
                backgroundColor: "var(--primary)",
                marginTop: "10px"
            }}>
            <Container>
                <Row>
                    <Col><small>Links</small></Col>
                    <Col><small>Help</small></Col>
                    <Col><small>About</small></Col>
                </Row>
                <Row>
                    <Col>
                        <Link to="/" onClick={() => {
                            dispatch(resetBag());
                            dispatch(setCurrentCode({ currentCode: null }));
                            dispatch(setCachedPassword({ cachedPassword: null }));
                            dispatch(setPasswordFor({ cachedPasswordFor: null }));
                        }}>Home</Link>
                    </Col>
                    <Col>
                        <Link to="/feedback">Feedback</Link>
                    </Col>
                    <Col>
                        <Link to="/legal">Legal</Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Link to="/bag/ABCD-1234">Example bag</Link>
                    </Col>
                    <Col>
                        <Link to="/contact">Contact</Link>
                    </Col>
                    <Col>
                        <Link to="/about">About</Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;
import { useDispatch, useSelector } from "react-redux";

import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

import { LinkContainer } from "react-router-bootstrap";

import { resetBag } from "../features/bag/bagSlice";
import { setNickname, selectNickname, setCachedPassword, setCurrentCode, setPasswordFor } from "../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";

import logo from "../logo.svg";



const TopNav = () => {
    const dispatch = useDispatch();
    const nickname = useSelector(selectNickname);
    const validNickname = nickname.length > 0 && nickname.length <= 32;

    return (
        <Navbar style={{ marginBottom: "10px" }} bg="primary">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand
                        onClick={e => {
                            dispatch(resetBag());
                            dispatch(setCurrentCode({ currentCode: null }));
                            dispatch(setCachedPassword({ cachedPassword: null }));
                            dispatch(setPasswordFor({ cachedPasswordFor: null }));
                        }}>
                        <img
                            src={logo}
                            width="64"
                            height="64"
                            className="d-inline-block align-middle"
                            alt="Extradimensional Logo"

                        />
                        Extradimension.al
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Form inline>
                        <Form.Label style={{ paddingRight: "4px" }}>
                            Nickname
                    </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Set Nickname"
                            defaultValue={nickname}
                            invalid={!validNickname}
                            maxLength="32"
                            onChange={e => {
                                dispatch(setNickname({ nickname: e.target.value.trim() }));
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            Nicknames must be between 1 and 32 characters.
                        </Form.Control.Feedback>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default TopNav;

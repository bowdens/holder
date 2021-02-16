import { useDispatch, useSelector } from "react-redux";

import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

import { LinkContainer } from "react-router-bootstrap";

import { resetBag } from "../features/bag/bagSlice";
import { setNickname, selectNickname, setCachedPassword, setCurrentCode, setPasswordFor } from "../features/auth/authSlice";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";



const TopNav = () => {
    const dispatch = useDispatch();
    const nickname = useSelector(selectNickname);

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
                        Holder!
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
                            onChange={e => {
                                dispatch(setNickname({ nickname: e.target.value }));
                            }}
                        />
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default TopNav;

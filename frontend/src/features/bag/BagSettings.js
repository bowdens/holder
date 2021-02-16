import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import {
    selectBag,
    selectPassword,
    selectPasswordRequired,
    updateName,
    updatePassword,
    updatePasswordRequired
} from "./bagSlice.js";



const BagSettings = () => {
    const { code } = useParams();
    const bag = useSelector(selectBag);
    const pr = useSelector(selectPasswordRequired);
    const pw = useSelector(selectPassword);
    const dispatch = useDispatch();

    const [name, setName] = useState(bag.name);
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [passwordRequired, setPasswordRequired] = useState(pr);

    const maxNameLength = 32;
    const minPasswordLength = 4;
    const maxPasswordLength = 32;

    const validName = name.length > 0 && name.length <= maxNameLength;
    const validPassword = 
        (pw !== null && password.length === 0)                      /* there is a currently set password and we're not updating*/
        || (password.length >= minPasswordLength 
            && password.length <= maxPasswordLength)                /* typed password has a valid length */
        || (!passwordRequired && password.length == 0);             /* we are setting the password to not required */
    const passwordsMatch = password === cPassword;
    const validForm = validName && validPassword && passwordsMatch;

    const changes = [];
    const objChanges = {};
    if (bag.name !== name) {
        objChanges.name = name;
        changes.push(`Changed bag name from "${bag.name}" to "${name}"`);
    }
    if (password !== "" && pw !== password) {
        objChanges.password = password;
        changes.push("Updated password");
    }
    if (pr !== passwordRequired) {
        objChanges.passwordRequired = passwordRequired;
        changes.push(`Changed password requirement from "${pr ? "required" : "not required"}" to "${passwordRequired ? "required" : "not required"}"`)
    }

    return (
        <>
            <Row>
                <Col>
                    <h3>Settings</h3>
                </Col>
                <Col>
                    <div className="text-right">
                        <Link to={`/bag/${code}`}>Back to bag</Link>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group>
                            <Form.Label>Bag Name</Form.Label>
                            <Form.Control
                                type="text" placeholder="Enter Bag Name"
                                defaultValue={name} onChange={e => setName(e.target.value)}
                                isInvalid={!validName}
                            />
                            {!validName ?
                                <>
                                    <Alert variant="danger" style={{ marginTop: "4px" }}>
                                        Your name must be between 1 and {maxNameLength} characters.
                                    </Alert>
                                </>
                                :
                                null
                            }
                        </Form.Group>
                        {/* TODO: implement passwords
                        <hr />
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password" placeholder="Enter Password"
                                onChange={e => setPassword(e.target.value)}
                                isInvalid={!validPassword}
                            />

                            {!validPassword ?
                                <>
                                    <Alert variant="danger" style={{ marginTop: "4px" }}>
                                        Your password must be between {minPasswordLength} and {maxPasswordLength} characters.
                                    </Alert>
                                </>
                                :
                                null
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password" placeholder="Confirm Password"
                                onChange={e => setCPassword(e.target.value)}
                                isInvalid={!passwordsMatch}
                            />
                            {!passwordsMatch ?
                                <>
                                    <Alert variant="danger" style={{ marginTop: "4px" }}>
                                        Your passwords do not match
                                    </Alert>

                                </>
                                :
                                null
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={pr}
                                label="Use Password for bag"
                                onClick={e => {
                                    console.log("pressed check");
                                    console.log(e.target.checked);
                                    setPasswordRequired(e.target.checked)
                                }}
                            />
                            <Form.Text className="text-muted">
                                Users {`${passwordRequired ? "will": "will not"}`} be required to enter a password before they can access your bag.
                            </Form.Text>
                        </Form.Group>

                        */}
                        <hr />
                        <Form.Group>
                            <Form.Label>Changes</Form.Label> <br />
                            {changes.length == 0 ?
                                <span className="text-muted">None.</span>
                                :
                                changes.map(c =>
                                    <Alert variant="info" 
                                        key={
                                            c.split("").reduce((a,u)=>a+u.charCodeAt(0),0)
                                        }>{c}</Alert>)
                            }
                        </Form.Group>
                        <hr />
                        <div className="text-right">
                            <Link to={`/bag/${code}`}>
                                <Button variant="primary" disabled={!validForm}
                                    onClick={e => {
                                        if (!validForm) {
                                            e.preventDefault();
                                            alert("Invalid data was specified!");
                                            return;
                                        }
                                        if (objChanges.name !== undefined) {
                                            dispatch(updateName({ name }));
                                        }
                                        if (objChanges.password !== undefined) {
                                            dispatch(updatePassword({ password }))
                                        }
                                        if (objChanges.passwordRequired !== undefined) {
                                            dispatch(updatePasswordRequired({ passwordRequired }));
                                        }

                                    }}>
                                    Save
                                </Button>
                            </Link>
                            {' '}
                            <Link to={`/bag/${code}`}>
                                <Button variant="secondary" onClick={e => {
                                    if (changes.length !== 0 &&
                                        !window.confirm("Are you sure you want to cancel? Unsaved progress will be lost")) {
                                        e.preventDefault();
                                    }
                                }}>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default BagSettings;
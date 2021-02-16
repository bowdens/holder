import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { setCurrentCode } from "../features/auth/authSlice";
import { setPending } from "../features/bag/bagSlice";
import { createOrGetSocket } from "../socket";

const CreateBag = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");

    const minNameLength = 1;
    const maxNameLength = 64;
    const nameValid =
        name.length >= minNameLength &&
        name.length <= maxNameLength;

    const minPasswordLength = 4;
    const passwordValid = (password.length === 0)
        || (password.length >= minPasswordLength);
    const passwordsMatch = password === cPassword;

    const formValid = nameValid && passwordValid && passwordsMatch;

    const usePassword = password.length > 0;

    return (
        <>
            <Form>
                <div className="text-center">
                    <Form.Label>
                        Create New Bag
                    </Form.Label>
                </div>
                <Form.Group>
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control
                        type="text"
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        isInvalid={!nameValid}
                    />
                    <Form.Control.Feedback type="invalid">
                        Your name must be between {minNameLength} and {maxNameLength} characters long.
                    </Form.Control.Feedback>
                </Form.Group>
                {/* TODO: implement passwords
                <hr />
                <Form.Group>
                    <Form.Label>
                        Password (optional)
                    </Form.Label>
                    <Form.Control
                        type="password"
                        isInvalid={!passwordValid}
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Your password must be at least {minPasswordLength} characters long.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>
                        Confirm Password
                    </Form.Label>
                    <Form.Control
                        type="password"
                        isInvalid={!passwordsMatch}
                        onChange={e => {
                            setCPassword(e.target.value);
                        }}
                    />
                    <Form.Control.Feedback type="invalid">
                        Your passwords do not match!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        checked={usePassword}
                        label="Use Password for Bag"
                        readOnly
                        disabled
                    />
                    <Form.Text className="text-muted">
                        Users {`${usePassword ? "will" : "will not"}`} be required to enter a password before they can access your bag.
                    </Form.Text>

                </Form.Group>
                */}
                <hr />
                <div className="text-center">
                    <Button
                        disabled={!formValid}
                        onClick={e => {
                            console.log("getting socket in createBag");
                            const { socket } = createOrGetSocket();
                            if (socket === null) {
                                console.error("tried to get socket but it was null");
                                alert("An error occurred trying to create your bag. please refresh your page and try again");
                            } else {
                                socket.emit("create_bag", name);
                                dispatch(setPending(true));
                            }
                        }}>
                        Create Bag
                    </Button>
                </div>
            </Form>
        </>
    );
}

export default CreateBag;
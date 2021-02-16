import { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrentCode } from "../features/auth/authSlice";

const ConnectToBag = () => {
    const dispatch = useDispatch();
    const [pending, setPending] = useState(false);
    const [code, setCode] = useState("");

    const validCodeRegex = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
    const codeValid = validCodeRegex.test(code);
    const displayCodeInvalid = !codeValid && code.length > 0;

    return (
        <>
            <Form onSubmit={e => {
                dispatch(setCurrentCode({ currentCode: code.toUpperCase() }));
            }}>
                <div className="text-center">
                    <Form.Label>
                        Connect To Bag
                    </Form.Label>
                </div>
                {pending ?
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter Bag Code"
                                size="lg"
                                onChange={e => {
                                    setCode(e.target.value);
                                }}
                                isInvalid={displayCodeInvalid}
                            />
                            <Form.Control.Feedback type="invalid">
                                That doesn't look like a valid code! Codes are in the form XXXX-XXXX.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="text-center">
                            <Link to={`/bag/${code}`}>
                                <Button
                                    onClick={e => {
                                        dispatch(setCurrentCode({ currentCode: code }));
                                    }}>
                                    Connect
                                </Button>
                            </Link>
                        </div>
                    </>
                }
            </Form>
        </>
    );
}

export default ConnectToBag;
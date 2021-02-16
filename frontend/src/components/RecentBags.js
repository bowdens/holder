import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { setCurrentCode } from "../features/auth/authSlice";


const RecentBags = () => {
    const [bags, setBags] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const _bags = localStorage.getItem("prevBags");
        console.log("trying to parse");
        console.log(_bags);
        try {
            console.log(JSON.parse(_bags));
            setBags(JSON.parse(_bags));
        } catch {
            console.log("failed to parse bags");
            setBags(null);
        }
    }, []);

    return (
        <>
            <h5>Recent Bags</h5>
            <ListGroup style={{maxHeight: "30vh", overflowY: "auto"}}>
                {bags === null || bags.length === 0 ?
                    <span className="text-muted">
                        You have no recent bags.
                </span>
                    :
                    bags.map(bag =>
                        <ListGroup.Item key={bag.code}>
                            <Row>
                                <Col className="align-middle">
                                        {bag.code} - {bag.name}
                                </Col>
                                <Col>
                                    <div className="text-right">
                                        <Button onClick={() => {
                                            console.log("connected for bag ");
                                            console.log(bag);
                                            dispatch(setCurrentCode({currentCode: bag.code}));
                                        }}>Connect</Button>
                                    </div>
                                </Col>
                            </Row>
                        </ListGroup.Item>)
                }

            </ListGroup>
        </>
    );
}

export default RecentBags;
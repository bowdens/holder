import { useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Collapse from "react-bootstrap/Collapse";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

import { NewCustom, NewSRD } from "./NewItems";

import "./AddItem.css";

const AddItem = () => {
    const [adding, setAdding] = useState("none");
    const customOpen = adding === "custom";
    const srdOpen = adding === "srd";
    const anyOpen = customOpen || srdOpen;

    return (
        <>
            <Row>
                <Col className="text-center">
                    <Button onClick={() => {
                        setAdding(adding === "custom" ? "none" : "custom");
                    }} variant={customOpen ? "dark" : "secondary"} >
                        {customOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        Add Custom Item
                    </Button>
                </Col>
                <Col className="text-center">
                    <Button onClick={() => {
                        setAdding(adding === "srd" ? "none" : "srd");
                    }} variant={srdOpen ? "dark" : "secondary"} >
                        {srdOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        Add 5e Item
                    </Button>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <Collapse in={anyOpen}>
                        <div>
                            {customOpen ?
                                <NewCustom />
                                : srdOpen ?
                                    <NewSRD />
                                    :
                                    null
                            }
                        </div>
                    </Collapse>
                </Col>
            </Row>
        </>
    )
}

export default AddItem;
import { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import AccordionContext from "react-bootstrap/AccordionToggle";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import ItemList from "./ItemList";
import ListQuery from "./ListQuery"

import "./NewCustom.css";
import { selectSrdItems } from "../srdItems/srdItemsSlice";
import { addItem, selectItems } from "./bagSlice";

export const NewCustom = () => {

    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState("");

    const currentItems = useSelector(selectItems);

    const nameLength = name.length;
    const maxNameLength = 64;
    const descriptionLength = description.length;
    const maxDescriptionLength = 1024;

    const uniqueName = currentItems.find(i => i.name.toLowerCase() === name.toLowerCase()) === undefined;
    const validName = nameLength >= 1 && nameLength <= maxNameLength;
    const validQuantity = quantity >= 0;
    const validDescription = descriptionLength <= 1000;

    const validItem = uniqueName && validName && validDescription && validQuantity;


    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" onChange={e => setName(e.target.value)} />
                    <Form.Text className={nameLength <= maxNameLength && nameLength >= 1 ? "text-muted" : "text-danger"}>
                        {nameLength}/{maxNameLength} characters.
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" defaultValue={1} min="0" onChange={e => setQuantity(e.target.value)} />
                    <Form.Text className="text-muted">
                        The number of items you have.
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter Description" onChange={e => setDescription(e.target.value)} />
                    <Form.Text className={descriptionLength <= maxDescriptionLength ? "text-muted" : "text-danger"}>
                        {descriptionLength}/{maxDescriptionLength} characters.
                    </Form.Text>
                </Form.Group>
                <hr />
                {uniqueName ?
                    null
                    :
                    <Alert variant="danger">
                        The name must be unique. You already have an item called {name} in your bag.
                    </Alert>
                }
                {validName ?
                    null
                    :
                    <Alert variant="danger">
                        The name must be between 1 and {maxNameLength} characters.
                    </Alert>
                }
                {validQuantity ?
                    null
                    :
                    <Alert variant="danger">
                        The Quantity must be 0 or greater.
                    </Alert>
                }
                {validDescription ?
                    null
                    :
                    <Alert variant="danger">
                        The Description must be no longer than {maxDescriptionLength} characters.
                    </Alert>
                }
                <div class="text-center">
                    <Button
                        variant="primary"
                        disabled={!validItem}
                        onClick={() => {
                            dispatch(addItem({ item: { name, quantity, description } }));
                        }}>
                        Add Item
                        </Button>
                </div>
            </Form>
        </>
    );
}

const SrdElement = ({ children }) => {
    const item = children;
    const currentEventKey = useContext(AccordionContext);
    const isExpanded = currentEventKey === item.name;

    const dispatch = useDispatch();

    return (
        <Card>
            <Accordion.Toggle as={Card.Header}
                eventKey={item.name}>
                {isExpanded ?
                    <KeyboardArrowUpIcon />
                    :
                    <KeyboardArrowDownIcon />

                }
                <span style={{ cursor: "pointer" }}>{item.name}</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={item.name}>
                <Card.Body>
                    {item.description.split('\n').map(p =>
                        <span style={{ display: "block" }}>{p}</span>)}
                    <hr />
                    <p>Quantity: {item.defaultquantity}</p>
                    <hr />
                    <div className="text-center">
                        <Button onClick={() => {
                            dispatch(addItem({
                                item: {
                                    name: item.name,
                                    description: item.description,
                                    quantity: item.defaultquantity
                                }
                            }));
                        }}>Add Item</Button>
                    </div>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}

export const NewSRD = () => {
    const srdItems = useSelector(selectSrdItems);
    const currentItems = useSelector(selectItems);
    const uniqueItems = [];

    for (const item of srdItems) {
        if (!currentItems.find(i => i.name.toLowerCase() === item.name.toLowerCase())) {
            uniqueItems.push(item);
        }
    }
    return (
        <>
            <ListQuery items={uniqueItems}>
                <ItemList Element={SrdElement} />
            </ListQuery>
        </>
    );
}
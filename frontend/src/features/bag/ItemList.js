import { useContext } from "react";
import { useDispatch } from "react-redux";

import { removeItem, updateItem, updateName } from "./bagSlice";
//import Editable from "../../components/Editable";
import Editable from "../editable/Editable";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import AccordionContext from "react-bootstrap/AccordionContext";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { EditableModal } from "../editable/EditableModal";
import { setEditItem, setEditItemName, setModalOpen } from "../editable/editableSlice";

export const ItemElement = ({ children }) => {
    const dispatch = useDispatch();
    const item = children;
    const currentEventKey = useContext(AccordionContext);
    const isExpanded = currentEventKey === item.name;

    return (
        <Card>
            <Accordion.Toggle as={Card.Header}
                eventKey={item.name}
            >
                {isExpanded ?
                    <KeyboardArrowUpIcon />
                    :
                    <KeyboardArrowDownIcon />

                }
                <span style={{ cursor: "pointer" }}>{item.name}</span>
                <span style={{ float: "right", cursor: "pointer" }} onClick={e => {
                    e.stopPropagation();
                    if (window.confirm(`This will delete your ${item.name} permanently. Are you sure?`)) {
                        dispatch(removeItem({ name: item.name }));
                    }
                }} className="remove-icon"><DeleteIcon /></span>
                <span style={{ float: "right", cursor: "pointer" }} onClick={e => {
                    e.stopPropagation();
                    dispatch(setEditItem({ item }));
                    dispatch(setEditItemName({ name: item.name }));
                    dispatch(setModalOpen({ open: true }));
                }}>
                    <EditIcon />
                </span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={item.name}>
                <Card.Body>
                    <Editable>{item}</Editable>
                    {/*
                    <Editable
                        placeholder="Enter Name"
                        label="Name"
                        updateText={name =>
                            dispatch(updateItem({
                                name: item.name,
                                item: { ...item, name }
                            }))
                        }>{item.name}</Editable>
                    <Editable
                        placeholder="Enter Quantity"
                        label="Quantity"
                        type="number"
                        updateText={quantity =>
                            dispatch(updateItem({
                                name: item.name,
                                item: { ...item, quantity }
                            }))
                        }>{item.quantity}</Editable>
                    <Editable
                        type="textarea"
                        label="Description"
                        placeholder="Enter Description"
                        updateText={description =>
                            dispatch(updateItem({
                                name: item.name,
                                item: { ...item, description }
                            }))}>{item.description}</Editable>
                    */}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

const ItemList = ({ children, Element }) => {
    return (
        <>
            <Accordion className="item-list" style={{ width: "100%", maxHeight: "50vh", overflowY: "auto" }}>
                {children.length === 0 ?
                    <span className="text-muted">No Items!</span>
                    :
                    <>{
                        children.map(item => <Element key={item.name}>{item}</Element>)
                    }</>
                }
            </Accordion>
            <EditableModal />
        </>
    );
}

export default ItemList;
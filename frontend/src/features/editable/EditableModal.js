import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";

import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

import {
    selectEditModalOpen,
    selectEditItem,
    selectEditName,
    setModalOpen
} from "./editableSlice";
import { updateItem } from "../bag/bagSlice";


export const EditableModal = () => {
    const dispatch = useDispatch();
    const showModal = useSelector(selectEditModalOpen);

    const nameRef = useRef(null);
    const quantityRef = useRef(null);
    const descriptionRef = useRef(null);

    const itemName = useSelector(selectEditName);
    const item = useSelector(selectEditItem);

    const handleClose = () => dispatch(setModalOpen({ open: false }));
    const handleSave = () => {
        handleClose();
        dispatch(updateItem({
            name: itemName,
            item: {
                name: nameRef.current.value,
                quantity: Number(quantityRef.current.value),
                description: descriptionRef.current.value
            }
        }));
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit {itemName ? itemName : `falsy - ${itemName}`}
                </Modal.Title>
            </Modal.Header>
            {item ?
                <>
                    <Modal.Body>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Item Name"
                                defaultValue={item.name}
                                ref={nameRef}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Quantity</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Quantity"
                                defaultValue={item.quantity}
                                type="number"
                                min="1"
                                ref={quantityRef}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Description</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Description"
                                defaultValue={item.description}
                                as="textarea"
                                ref={descriptionRef}
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                </Button>
                    </Modal.Footer>
                </>
                :
                <>
                    <p>Item is null</p>
                </>
            }

        </Modal>
    );
}

export default EditableModal;
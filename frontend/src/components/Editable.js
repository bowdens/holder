import { useState, useRef } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

import "./Editable.css";

const Editable = ({ children, updateText = () => alert("update not implemented"), type = "text", placeholder = "", label = null }) => {
    const [editable, setEditable] = useState(false);
    const input = useRef(null);
    return (
        <div className="editable">
            <InputGroup>
                {label !== null ?
                    <>
                        <InputGroup.Prepend className="max20">
                            <InputGroup.Text >
                                <span className="text-center">
                                    {label}
                                </span>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        {' '}
                    </>
                    :
                    null
                }
                {type === "textarea" ?
                    <FormControl style={{ height: "200px" }} placeholder={placeholder} defaultValue={children} plaintext={!editable} readOnly={!editable} ref={input} as="textarea" />
                    :
                    <FormControl placeholder={placeholder} defaultValue={children} plaintext={!editable} readOnly={!editable} ref={input} type={editable || type === "password" ? type : "text"} />
                }
                <InputGroup.Append>
                    {editable ?
                        <>
                            <InputGroup.Text onClick={e => {
                                updateText(input.current.value);
                                setEditable(false);
                                e.stopPropagation();
                            }} >
                                <SaveIcon />
                            </InputGroup.Text>
                            <InputGroup.Text onClick={e => {
                                console.log("on close text is");
                                console.log(input.current.value);
                                console.log("and children is");
                                console.log(children);
                                if (input.current.value === undefined) {
                                    input.current.value = "";
                                } else {
                                    input.current.value = children;
                                }
                                setEditable(false);
                                e.stopPropagation();
                            }}>
                                <CloseIcon />
                            </InputGroup.Text>
                        </>
                        :
                        <InputGroup.Text onClick={e => {
                            setEditable(true);
                            input.current.focus();
                            e.stopPropagation();
                        }}>
                            <EditIcon />
                        </InputGroup.Text>
                    }
                </InputGroup.Append>
            </InputGroup>
        </div>
    );
}

export default Editable;
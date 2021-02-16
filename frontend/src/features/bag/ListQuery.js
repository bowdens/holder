import { useState, useRef, cloneElement } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import FilterIcon from "@material-ui/icons/FilterList";

const ListQuery = ({ children, items }) => {
    const [query, setQuery] = useState("");

    return (
        <>
            <InputGroup style={{marginBottom: "5px"}}>
                <InputGroup.Prepend>
                    <InputGroup.Text>
                        <FilterIcon />
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Filter Items"
                    onChange={e => setQuery(e.target.value)}
                />
            </InputGroup>
            { cloneElement(children, {
                children: items ? items.filter(i => {
                    return (query === "" || i.name.toLowerCase().includes(query.toLowerCase()))
                }).slice(0, 30) : []
            })}
        </>
    )
}

export default ListQuery;